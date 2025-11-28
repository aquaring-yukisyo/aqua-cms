import { defineStorage } from "@aws-amplify/backend";

/**
 * AQUA CMS - Storage設定
 * 画像アップロード用のS3バケット設定（完全パブリック）
 */
export const storage = defineStorage({
  name: "aquaCmsStorage",
  access: (allow) => ({
    // お知らせ用画像をパブリックに設定
    "public/news-images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    // その他のpublicファイル
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});

