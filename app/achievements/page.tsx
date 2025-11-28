import Link from "next/link";
import { formatDate } from "@/app/lib/date-utils";
import { truncateText, stripMarkdown } from "@/app/lib/utils";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import outputs from "@/amplify_outputs.json";

type Achievement = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imageKey?: string | null;
  category?: string | null;
  client?: string | null;
  url?: string | null;
  status: string;
  publishedAt?: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
};

// 動的レンダリング - 常に最新のデータを表示
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const apiUrl = outputs.data?.url;
    const apiKey = outputs.data?.api_key;

    if (!apiUrl || !apiKey) {
      console.error("Amplify configuration not found");
      return [];
    }

    const query = `
      query ListAchievementsByStatus {
        listAchievementsByStatus(status: PUBLISHED, limit: 100, sortDirection: DESC) {
          items {
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
      }
    `;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store', // キャッシュなし - 常に最新データを取得
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return [];
    }

    const items = result.data?.listAchievementsByStatus?.items || [];

    return items.sort((a: Achievement, b: Achievement) => {
      if (!a.publishedAt || !b.publishedAt) return 0;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

export default async function AchievementsPage() {
  const achievements = await fetchAchievements();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 rounded-2xl p-8 md:p-12 mb-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            実績紹介
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            これまでの制作実績をご紹介します
          </p>
        </div>

        {/* 実績一覧 */}
        <div className="mb-8">
          {achievements.length === 0 && (
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">
                実績はまだありません
              </p>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Link
                  key={achievement.id}
                  href={`/achievements/${achievement.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 group"
                >
                  {achievement.imageUrl && (
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {achievement.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                          {achievement.category}
                        </span>
                      )}
                      {achievement.publishedAt && (
                        <time className="text-sm text-gray-500">
                          {formatDate(achievement.publishedAt)}
                        </time>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                      {achievement.title}
                    </h3>
                    {achievement.client && (
                      <p className="text-sm text-gray-600 mb-2">
                        クライアント: {achievement.client}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {truncateText(stripMarkdown(achievement.description), 100)}
                    </p>
                    <div className="mt-4 flex items-center text-secondary-600 text-sm font-medium">
                      詳しく見る
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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

