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
import { RebuildButton } from "@/app/components/RebuildButton";
import type { Schema } from "@/amplify/data/resource";

type News = Schema["News"]["type"];

export default function AdminDashboard() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await client.models.News.list({
        limit: 100,
      });

      if (errors) {
        throw new Error("お知らせの取得に失敗しました");
      }

      // 更新日時で降順ソート
      const sortedNews = (data || []).sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      setNewsList(sortedNews);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(
        err instanceof Error ? err.message : "お知らせの取得に失敗しました"
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
      const { errors } = await client.models.News.delete({ id });

      if (errors) {
        throw new Error("削除に失敗しました");
      }

      alert("削除しました");
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  const handleToggleStatus = async (news: News) => {
    try {
      const newStatus = news.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const updateData: any = {
        id: news.id,
        status: newStatus,
      };

      // 公開する場合は公開日時を設定
      if (newStatus === "PUBLISHED" && !news.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }

      const { errors } = await client.models.News.update(updateData);

      if (errors) {
        throw new Error("ステータスの変更に失敗しました");
      }

      fetchNews();
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
    fetchNews();
  }, []);

  const filteredNews = newsList.filter((news) => {
    if (filterStatus === "ALL") return true;
    return news.status === filterStatus;
  });

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* ヘッダーセクション */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ダッシュボード
            </h1>

            {/* 再構築ボタンエリア */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                公開サイトの管理
              </h2>
              <RebuildButton onRebuildComplete={fetchNews} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* フィルター */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">表示:</span>
                <button
                  onClick={() => setFilterStatus("ALL")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "ALL"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setFilterStatus("PUBLISHED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "PUBLISHED"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  公開中
                </button>
                <button
                  onClick={() => setFilterStatus("DRAFT")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "DRAFT"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  下書き
                </button>
              </div>

              {/* 新規作成ボタン */}
              <Link
                href="/admin/news/new"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
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

          {error && <ErrorMessage message={error} retry={fetchNews} />}

          {!loading && !error && filteredNews.length === 0 && (
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                お知らせがありません
              </p>
              <Link
                href="/admin/news/new"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                最初のお知らせを作成
              </Link>
            </div>
          )}

          {!loading && !error && filteredNews.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイトル
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
                    {filteredNews.map((news) => (
                      <tr key={news.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {news.imageUrl && (
                              <img
                                src={news.imageUrl}
                                alt=""
                                className="w-12 h-12 rounded object-cover mr-3"
                              />
                            )}
                            <div className="font-medium text-gray-900">
                              {news.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {news.status === "PUBLISHED" ? (
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
                          {formatDateTime(news.updatedAt)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/news/${news.id}/edit`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              編集
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(news)}
                              className="text-secondary-600 hover:text-secondary-700"
                            >
                              {news.status === "PUBLISHED"
                                ? "下書きに戻す"
                                : "公開"}
                            </button>
                            <button
                              onClick={() => handleDelete(news.id, news.title)}
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

