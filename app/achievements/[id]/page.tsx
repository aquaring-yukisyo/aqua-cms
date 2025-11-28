import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDateTime } from "@/app/lib/date-utils";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import outputs from "@/amplify_outputs.json";

type Achievement = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category?: string | null;
  client?: string | null;
  url?: string | null;
  status: string;
  publishedAt?: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
};

// ISR: 手動再検証のみ（再構築ボタンでのみ更新）
export const revalidate = false;

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchAchievement(achievementId: string): Promise<Achievement | null> {
  try {
    const apiUrl = outputs.data?.url;
    const apiKey = outputs.data?.api_key;

    if (!apiUrl || !apiKey) {
      console.error("Amplify configuration not found");
      return null;
    }

    const query = `
      query GetAchievement($id: ID!) {
        getAchievement(id: $id) {
          id
          title
          description
          imageUrl
          category
          client
          url
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
        variables: { id: achievementId },
      }),
      next: { 
        tags: ['achievements-detail', `achievement-${achievementId}`],
      },
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const achievement = result.data?.getAchievement;

    if (!achievement || achievement.status !== "PUBLISHED") {
      return null;
    }

    return achievement;
  } catch (error) {
    console.error("Error fetching achievement:", error);
    return null;
  }
}

export default async function AchievementDetailPage({ params }: Props) {
  const { id: achievementId } = await params;
  const achievement = await fetchAchievement(achievementId);

  if (!achievement) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* 戻るボタン */}
          <Link
            href="/achievements"
            className="mb-6 flex items-center text-gray-600 hover:text-secondary-600 transition-colors"
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
            実績一覧に戻る
          </Link>

          {/* 実績カード */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {achievement.imageUrl && (
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {achievement.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                    {achievement.category}
                  </span>
                )}
                {achievement.publishedAt && (
                  <time className="text-gray-600">
                    {formatDateTime(achievement.publishedAt)}
                  </time>
                )}
              </div>

              {/* タイトル */}
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                {achievement.title}
              </h1>

              {/* クライアント情報 */}
              {achievement.client && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">クライアント</p>
                  <p className="text-lg font-medium text-gray-900">
                    {achievement.client}
                  </p>
                </div>
              )}

              {/* 説明 */}
              <div className="markdown-content mb-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {achievement.description}
                </ReactMarkdown>
              </div>

              {/* プロジェクトURL */}
              {achievement.url && (
                <div className="mt-8 p-6 bg-secondary-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">プロジェクトURL</p>
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium"
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    サイトを見る
                  </a>
                </div>
              )}

              {/* 作成者情報 */}
              {achievement.author && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    担当者: {achievement.author}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 戻るボタン（下部） */}
          <div className="mt-8 text-center">
            <Link
              href="/achievements"
              className="inline-block px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              実績一覧に戻る
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

