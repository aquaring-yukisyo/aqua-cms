import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * AQUA CMS - GraphQL Schema
 * お知らせ管理システムのデータモデル定義
 */

const schema = a.schema({
  // ステータスの定義
  NewsStatus: a.enum(["DRAFT", "PUBLISHED"]),

  // Newsモデル
  News: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      imageUrl: a.string(),
      imageKey: a.string(),
      status: a.ref("NewsStatus").required(),
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
