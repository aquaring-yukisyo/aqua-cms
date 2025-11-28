/**
 * テキストを指定した文字数で切り詰める
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * マークダウンから書式を削除してプレーンテキストを取得
 */
export const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/#{1,6}\s/g, "") // ヘッダー
    .replace(/\*\*(.+?)\*\*/g, "$1") // 太字
    .replace(/\*(.+?)\*/g, "$1") // イタリック
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // リンク
    .replace(/`(.+?)`/g, "$1") // コード
    .replace(/\n+/g, " ") // 改行
    .trim();
};

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

/**
 * 画像ファイルかどうかをチェック
 */
export const isImageFile = (file: File): boolean => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return imageTypes.includes(file.type);
};

/**
 * 画像ファイルのバリデーション
 */
export const validateImageFile = (
  file: File,
  maxSizeInMB: number = 5
): { valid: boolean; error?: string } => {
  if (!isImageFile(file)) {
    return {
      valid: false,
      error: "画像ファイル（JPEG、PNG、GIF、WebP）のみアップロード可能です。",
    };
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `ファイルサイズは${maxSizeInMB}MB以下にしてください。`,
    };
  }

  return { valid: true };
};

