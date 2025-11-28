import Link from "next/link";
import { formatDate } from "@/app/lib/date-utils";
import { truncateText, stripMarkdown } from "@/app/lib/utils";
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

async function fetchNews(): Promise<News[]> {
  try {
    const apiUrl = outputs.data?.url;
    const apiKey = outputs.data?.api_key;

    if (!apiUrl || !apiKey) {
      console.error("Amplify configuration not found");
      return [];
    }

    const query = `
      query ListNewsByStatus {
        listNewsByStatus(status: PUBLISHED, limit: 100, sortDirection: DESC) {
          items {
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
      }
    `;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ query }),
      next: { 
        revalidate: false, // 完全にキャッシュ
        tags: ['news-list'] // タグベースで再検証
      },
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return [];
    }

    const items = result.data?.listNewsByStatus?.items || [];

    // publishedAtで降順ソート
    return items.sort((a: News, b: News) => {
      if (!a.publishedAt || !b.publishedAt) return 0;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function HomePage() {
  const newsList = await fetchNews();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 md:p-12 mb-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AQUA CMS へようこそ
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            最新のお知らせをお届けします
          </p>
        </div>

        {/* お知らせ一覧 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            最新のお知らせ
          </h2>

          {newsList.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">
                お知らせはまだありません
              </p>
            </div>
          )}

          {newsList.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsList.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
                >
                  {news.imageUrl && (
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        お知らせ
                      </span>
                      {news.publishedAt && (
                        <time className="text-sm text-gray-500">
                          {formatDate(news.publishedAt)}
                        </time>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {truncateText(stripMarkdown(news.content), 100)}
                    </p>
                    <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                      続きを読む
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
