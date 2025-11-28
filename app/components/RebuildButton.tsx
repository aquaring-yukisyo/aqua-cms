"use client";

import { useState } from "react";

type RebuildButtonProps = {
  onRebuildComplete?: () => void;
};

export const RebuildButton = ({ onRebuildComplete }: RebuildButtonProps) => {
  const [rebuilding, setRebuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRebuild = async () => {
    if (!confirm("サイトを再構築しますか？\n\n公開ページの静的ファイルが更新されます。")) {
      return;
    }

    setRebuilding(true);
    setError(null);

    try {
      // TODO: Lambda関数を呼び出す
      // 現在は簡易実装として、Next.jsのrevalidateを使用
      
      // 公開ページのキャッシュをクリア
      await fetch("/api/revalidate", {
        method: "POST",
      });

      alert("サイトの再構築を開始しました！\n\n数分後に公開ページが更新されます。");
      onRebuildComplete?.();
    } catch (err) {
      console.error("Rebuild error:", err);
      setError(
        err instanceof Error ? err.message : "再構築に失敗しました"
      );
    } finally {
      setRebuilding(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleRebuild}
        disabled={rebuilding}
        className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {rebuilding ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            再構築中...
          </>
        ) : (
          <>
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            サイトを再構築
          </>
        )}
      </button>

      <div className="text-sm text-gray-600">
        <p className="mb-2">💡 再構築について：</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>公開中のお知らせから静的ページを生成します</li>
          <li>お知らせを追加・編集・削除した後に実行してください</li>
          <li>再構築には数分かかる場合があります</li>
        </ul>
      </div>
    </div>
  );
};

