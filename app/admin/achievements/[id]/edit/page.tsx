"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "@/app/lib/amplify-client";
import { AuthGuard } from "@/app/components/AuthGuard";
import { AdminHeader } from "@/app/components/AdminHeader";
import { Footer } from "@/app/components/Footer";
import { Loading } from "@/app/components/Loading";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import { ImageUpload } from "@/app/components/ImageUpload";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";
import type { Schema } from "@/amplify/data/resource";

type Achievement = Schema["Achievement"]["type"];

export default function AchievementEditPage() {
  const params = useParams();
  const router = useRouter();
  const achievementId = params.id as string;

  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievement = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await client.models.Achievement.get({ id: achievementId });

      if (errors) {
        throw new Error("実績の取得に失敗しました");
      }

      if (!data) {
        throw new Error("実績が見つかりません");
      }

      setAchievement(data);
      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category || "");
      setClientName(data.client || "");
      setUrl(data.url || "");
      setImageUrl(data.imageUrl || "");
      setImageKey(data.imageKey || "");
    } catch (err) {
      console.error("Error fetching achievement:", err);
      setError(
        err instanceof Error ? err.message : "実績の取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievement();
  }, [achievementId]);

  const handleSave = async (status?: "DRAFT" | "PUBLISHED") => {
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
      const updateData: any = {
        id: achievementId,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || null,
        client: clientName.trim() || null,
        url: url.trim() || null,
      };

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
        updateData.imageKey = imageKey;
      } else {
        updateData.imageUrl = null;
        updateData.imageKey = null;
      }

      if (status) {
        updateData.status = status;
        if (status === "PUBLISHED" && !achievement?.publishedAt) {
          updateData.publishedAt = new Date().toISOString();
        }
      }

      const { data, errors } = await client.models.Achievement.update(updateData, {
        authMode: 'userPool'
      });

      if (errors) {
        throw new Error("実績の更新に失敗しました");
      }

      alert("更新しました");
      router.push("/admin/achievements");
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err instanceof Error ? err.message : "実績の更新に失敗しました"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      title !== achievement?.title ||
      description !== achievement?.description ||
      category !== (achievement?.category || "") ||
      clientName !== (achievement?.client || "") ||
      url !== (achievement?.url || "") ||
      imageUrl !== (achievement?.imageUrl || "")
    ) {
      if (!confirm("変更が保存されていません。破棄してもよろしいですか？")) {
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
            {loading && <Loading />}

            {error && <ErrorMessage message={error} retry={fetchAchievement} />}

            {!loading && !error && achievement && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    実績編集
                  </h1>
                  <div className="flex items-center space-x-3">
                    <p className="text-gray-600">
                      作成日: {new Date(achievement.createdAt).toLocaleString("ja-JP")}
                    </p>
                    {achievement.status === "PUBLISHED" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        公開中
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        下書き
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                      disabled={saving}
                    />
                    <div className="mt-1 text-xs text-gray-500 text-right">{title.length}/200</div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリ
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                      クライアント名
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                      プロジェクトURL
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all"
                      disabled={saving}
                    />
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明 <span className="text-red-500">*</span>
                    </label>
                    <MarkdownEditor value={description} onChange={setDescription} />
                  </div>

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
                      {achievement.status === "PUBLISHED" && (
                        <button
                          type="button"
                          onClick={() => handleSave("DRAFT")}
                          disabled={saving}
                          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {saving ? "保存中..." : "下書きに戻す"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {saving ? "保存中..." : "更新"}
                      </button>
                      {achievement.status === "DRAFT" && (
                        <button
                          type="button"
                          onClick={() => handleSave("PUBLISHED")}
                          disabled={saving}
                          className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {saving ? "公開中..." : "公開"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

