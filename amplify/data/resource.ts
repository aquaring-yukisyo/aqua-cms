import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * AQUA CMS - GraphQL Schema
 * お知らせ・実績管理システムのデータモデル定義
 */

const schema = a.schema({
  // ステータスの定義
  Status: a.enum(["DRAFT", "PUBLISHED"]),

  // Newsモデル
  News: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      imageUrl: a.string(),
      imageKey: a.string(),
      status: a.ref("Status").required(),
      publishedAt: a.datetime(),
      author: a.string().required(),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["publishedAt"]).queryField("listNewsByStatus"),
    ])
    .authorization((allow) => [
      // 認証ユーザー（管理者）は全操作可能
      allow.authenticated().to(["create", "read", "update", "delete"]),
      // API Key（一般ユーザー）は読み取りのみ可能
      allow.publicApiKey().to(["read"]),
    ]),

  // Achievementモデル（実績）
  Achievement: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      imageUrl: a.string(),
      imageKey: a.string(),
      category: a.string(), // カテゴリ（例：Web制作、アプリ開発）
      client: a.string(), // クライアント名
      url: a.string(), // プロジェクトURL
      status: a.ref("Status").required(),
      publishedAt: a.datetime(),
      author: a.string().required(),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["publishedAt"]).queryField("listAchievementsByStatus"),
    ])
    .authorization((allow) => [
      // 認証ユーザー（管理者）は全操作可能
      allow.authenticated().to(["create", "read", "update", "delete"]),
      // API Key（一般ユーザー）は読み取りのみ可能
      allow.publicApiKey().to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Keyでゲストアクセスを許可
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
