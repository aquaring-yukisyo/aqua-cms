import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDateTime } from "@/app/lib/date-utils";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import outputs from "@/amplify_outputs.json";

type News = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  imageKey?: string | null;
  status: string;
  publishedAt?: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
};

// 完全な静的生成 - 再構築ボタンでのみ更新
export const dynamic = 'force-static';
export const revalidate = false;

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchNews(newsId: string): Promise<News | null> {
  try {
    const apiUrl = outputs.data?.url;
    const apiKey = outputs.data?.api_key;

    if (!apiUrl || !apiKey) {
      console.error("Amplify configuration not found");
      return null;
    }

    const query = `
      query GetNews($id: ID!) {
        getNews(id: $id) {
          id
          title
          content
          imageUrl
          status
          publishedAt
          author
          createdAt
          updatedAt
        }
      }
    `;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        variables: { id: newsId },
      }),
      next: { 
        revalidate: false, // 完全にキャッシュ
        tags: [`news-${newsId}`] // タグベースで再検証
      },
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const news = result.data?.getNews;

    if (!news || news.status !== "PUBLISHED") {
      return null;
    }

    return news;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { id: newsId } = await params;
  const news = await fetchNews(newsId);

  if (!news) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* 戻るボタン */}
          <Link
            href="/"
            className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            一覧に戻る
          </Link>

          {/* お知らせカード */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {news.imageUrl && (
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  お知らせ
                </span>
                {news.publishedAt && (
                  <time className="text-gray-600">
                    {formatDateTime(news.publishedAt)}
                  </time>
                )}
              </div>

              {/* タイトル */}
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                {news.title}
              </h1>

              {/* コンテンツ */}
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {news.content}
                </ReactMarkdown>
              </div>

              {/* 作成者情報 */}
              {news.author && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    投稿者: {news.author}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 戻るボタン（下部） */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              一覧に戻る
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

