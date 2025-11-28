import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 日付を「YYYY年MM月DD日」形式でフォーマット
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy年MM月dd日", { locale: ja });
};

/**
 * 日付を「YYYY-MM-DD HH:mm」形式でフォーマット
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy年MM月dd日 HH:mm", { locale: ja });
};

/**
 * 相対時間を日本語で表示（例：「3日前」）
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ja });
};

