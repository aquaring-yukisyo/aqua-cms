import { defineStorage } from "@aws-amplify/backend";

/**
 * AQUA CMS - Storage設定
 * 画像アップロード用のS3バケット設定
 */
export const storage = defineStorage({
  name: "aquaCmsStorage",
  access: (allow) => ({
    // お知らせ用画像
    "news-images/*": [
      // 認証ユーザー（管理者）は全操作可能
      allow.authenticated.to(["read", "write", "delete"]),
      // ゲストユーザーは読み取りのみ
      allow.guest.to(["read"]),
    ],
    // 将来の拡張用
    "public/*": [
      allow.authenticated.to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
  }),
});

