"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "@/app/lib/amplify-client";
import { AuthGuard } from "@/app/components/AuthGuard";
import { AdminHeader } from "@/app/components/AdminHeader";
import { Footer } from "@/app/components/Footer";
import { ImageUpload } from "@/app/components/ImageUpload";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";

export default function AchievementCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    if (!description.trim()) {
      setError("説明を入力してください");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      const author = user.signInDetails?.loginId || "unknown";

      const achievementData: any = {
        title: title.trim(),
        description: description.trim(),
        status,
        author,
      };

      if (category.trim()) achievementData.category = category.trim();
      if (clientName.trim()) achievementData.client = clientName.trim();
      if (url.trim()) achievementData.url = url.trim();
      if (imageUrl) {
        achievementData.imageUrl = imageUrl;
        achievementData.imageKey = imageKey;
      }

      if (status === "PUBLISHED") {
        achievementData.publishedAt = new Date().toISOString();
      }

      const { data, errors } = await client.models.Achievement.create(achievementData);

      if (errors) {
        throw new Error("実績の作成に失敗しました");
      }

      alert(
        status === "PUBLISHED"
          ? "実績を公開しました"
          : "下書きとして保存しました"
      );
      router.push("/admin/achievements");
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err instanceof Error ? err.message : "実績の作成に失敗しました"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (title || description || category || clientName || url || imageUrl) {
      if (!confirm("入力内容が保存されていません。破棄してもよろしいですか？")) {
        return;
      }
    }
    router.push("/admin/achievements");
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                実績新規作成
              </h1>
              <p className="text-gray-600">
                新しい実績を作成して公開または下書き保存できます
              </p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* フォーム */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
              {/* タイトル */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                  placeholder="実績のタイトルを入力してください"
                  disabled={saving}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {title.length}/200
                </div>
              </div>

              {/* カテゴリ */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  カテゴリ
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                  placeholder="例：Web制作、アプリ開発"
                  disabled={saving}
                />
              </div>

              {/* クライアント */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  クライアント名
                </label>
                <input
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                  placeholder="クライアント名を入力してください"
                  disabled={saving}
                />
              </div>

              {/* プロジェクトURL */}
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  プロジェクトURL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com"
                  disabled={saving}
                />
              </div>

              {/* 画像アップロード */}
              <ImageUpload
                currentImageUrl={imageUrl}
                currentImageKey={imageKey}
                onImageUploaded={(url, key) => {
                  setImageUrl(url);
                  setImageKey(key);
                }}
                onImageRemoved={() => {
                  setImageUrl("");
                  setImageKey("");
                }}
              />

              {/* マークダウンエディタ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明 <span className="text-red-500">*</span>
                </label>
                <MarkdownEditor value={description} onChange={setDescription} />
              </div>

              {/* ボタン */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  キャンセル
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleSave("DRAFT")}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {saving ? "保存中..." : "下書き保存"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("PUBLISHED")}
                    disabled={saving}
                    className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {saving ? "公開中..." : "公開"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

