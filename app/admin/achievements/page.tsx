"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/app/lib/amplify-client";
import { formatDateTime } from "@/app/lib/date-utils";
import { AuthGuard } from "@/app/components/AuthGuard";
import { AdminHeader } from "@/app/components/AdminHeader";
import { Footer } from "@/app/components/Footer";
import { Loading } from "@/app/components/Loading";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import type { Schema } from "@/amplify/data/resource";

type Achievement = Schema["Achievement"]["type"];

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await client.models.Achievement.list({
        limit: 100,
      });

      if (errors) {
        throw new Error("実績の取得に失敗しました");
      }

      const sortedAchievements = (data || []).sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      setAchievements(sortedAchievements);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError(
        err instanceof Error ? err.message : "実績の取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      const { errors } = await client.models.Achievement.delete({ id });

      if (errors) {
        throw new Error("削除に失敗しました");
      }

      alert("削除しました");
      fetchAchievements();
    } catch (err) {
      console.error("Error deleting achievement:", err);
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  const handleToggleStatus = async (achievement: Achievement) => {
    try {
      const newStatus = achievement.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const updateData: any = {
        id: achievement.id,
        status: newStatus,
      };

      if (newStatus === "PUBLISHED" && !achievement.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }

      const { errors } = await client.models.Achievement.update(updateData);

      if (errors) {
        throw new Error("ステータスの変更に失敗しました");
      }

      fetchAchievements();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(
        err instanceof Error
          ? err.message
          : "ステータスの変更に失敗しました"
      );
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter((achievement) => {
    if (filterStatus === "ALL") return true;
    return achievement.status === filterStatus;
  });

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              実績管理
            </h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* フィルター */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">表示:</span>
                <button
                  onClick={() => setFilterStatus("ALL")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "ALL"
                      ? "bg-secondary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setFilterStatus("PUBLISHED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "PUBLISHED"
                      ? "bg-secondary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  公開中
                </button>
                <button
                  onClick={() => setFilterStatus("DRAFT")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "DRAFT"
                      ? "bg-secondary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  下書き
                </button>
              </div>

              {/* 新規作成ボタン */}
              <Link
                href="/admin/achievements/new"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                新規作成
              </Link>
            </div>
          </div>

          {loading && <Loading />}

          {error && <ErrorMessage message={error} retry={fetchAchievements} />}

          {!loading && !error && filteredAchievements.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
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
              <p className="text-gray-600 text-lg mb-4">
                実績がありません
              </p>
              <Link
                href="/admin/achievements/new"
                className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                最初の実績を作成
              </Link>
            </div>
          )}

          {!loading && !error && filteredAchievements.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイトル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        カテゴリ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        更新日時
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAchievements.map((achievement) => (
                      <tr key={achievement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {achievement.imageUrl && (
                              <img
                                src={achievement.imageUrl}
                                alt=""
                                className="w-12 h-12 rounded object-cover mr-3"
                              />
                            )}
                            <div className="font-medium text-gray-900">
                              {achievement.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {achievement.category || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {achievement.status === "PUBLISHED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              公開中
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              下書き
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(achievement.updatedAt)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/achievements/${achievement.id}/edit`}
                              className="text-secondary-600 hover:text-secondary-700"
                            >
                              編集
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(achievement)}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {achievement.status === "PUBLISHED"
                                ? "下書きに戻す"
                                : "公開"}
                            </button>
                            <button
                              onClick={() => handleDelete(achievement.id, achievement.title)}
                              className="text-red-600 hover:text-red-700"
                            >
                              削除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

