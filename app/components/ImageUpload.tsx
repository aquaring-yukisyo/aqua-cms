"use client";

import { useState, useRef } from "react";
import { uploadData, remove } from "aws-amplify/storage";
import { validateImageFile, formatFileSize } from "@/app/lib/utils";

type ImageUploadProps = {
  currentImageUrl?: string;
  currentImageKey?: string;
  onImageUploaded: (url: string, key: string) => void;
  onImageRemoved: () => void;
};

export const ImageUpload = ({
  currentImageUrl,
  currentImageKey,
  onImageUploaded,
  onImageRemoved,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // バリデーション
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "画像のアップロードに失敗しました");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // S3にアップロード
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const key = `news-images/${filename}`;

      const result = await uploadData({
        key,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      // 公開URLを生成
      const url = `https://${process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET}.s3.${process.env.NEXT_PUBLIC_AMPLIFY_REGION}.amazonaws.com/public/${key}`;

      onImageUploaded(url, key);
    } catch (err) {
      console.error("Upload error:", err);
      setError("画像のアップロードに失敗しました");
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("画像を削除してもよろしいですか？")) {
      return;
    }

    try {
      // S3から削除
      if (currentImageKey) {
        await remove({ key: currentImageKey });
      }

      setPreviewUrl(null);
      onImageRemoved();

      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Remove error:", err);
      alert("画像の削除に失敗しました");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        画像（任意）
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
            <img
              src={previewUrl}
              alt="プレビュー"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-sm">アップロード中...</div>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              画像を変更
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              画像を削除
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">
            {uploading ? "アップロード中..." : "画像をアップロード"}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            JPEG, PNG, GIF, WebP（最大5MB）
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

