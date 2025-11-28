# AQUA CMS 仕様書

## プロジェクト概要
簡易的なお知らせ管理システム（CMS）
- 管理者はお知らせの作成・編集・削除が可能
- 一般ユーザーはお知らせの閲覧のみ可能（認証不要）
- 画像アップロード機能を含む

## 技術スタック
- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: AWS Amplify Gen2
- **認証**: Amazon Cognito (Amplify Auth)
- **データベース**: AWS AppSync (GraphQL)
- **ストレージ**: Amazon S3 (Amplify Storage)
- **プロファイル**: se

---

## 機能要件

### 1. 認証機能
#### 管理者認証
- **ログイン方法**: メールアドレス + パスワード
- **認証プロバイダー**: Amazon Cognito
- **ログインページ**: `/admin/login`
- **セッション管理**: Amplify Auth自動管理
- **ログアウト機能**: あり

#### 認証フロー
1. 管理者が `/admin` 配下にアクセス
2. 未認証の場合、`/admin/login` にリダイレクト
3. ログイン成功後、元のページまたはダッシュボードへ遷移
4. 認証状態はセッションで保持

### 2. お知らせ機能

#### データモデル: News
| フィールド名 | 型 | 必須 | 説明 |
|------------|-----|-----|------|
| id | ID | ○ | 自動生成される一意のID |
| title | String | ○ | お知らせのタイトル（最大200文字） |
| content | String | ○ | お知らせの本文（マークダウン対応） |
| imageUrl | String | × | アップロードした画像のURL |
| imageKey | String | × | S3の画像キー（削除用） |
| status | Enum | ○ | 公開状態（DRAFT, PUBLISHED） |
| publishedAt | AWSDateTime | × | 公開日時 |
| createdAt | AWSDateTime | ○ | 作成日時（自動生成） |
| updatedAt | AWSDateTime | ○ | 更新日時（自動生成） |
| author | String | ○ | 作成者のメールアドレス |

#### ステータス
- **DRAFT**: 下書き（一般ユーザーには非表示）
- **PUBLISHED**: 公開中（一般ユーザーに表示）

### 3. 画像アップロード機能
- **アップロード先**: Amazon S3 (Amplify Storage)
- **対応フォーマット**: JPEG, PNG, GIF, WebP
- **最大ファイルサイズ**: 5MB
- **画像最適化**: クライアントサイドでリサイズ（最大幅: 1200px）
- **保存パス**: `news-images/{newsId}/{timestamp}-{filename}`
- **権限**:
  - アップロード: 認証ユーザーのみ
  - 閲覧: 全員（パブリック読み取り）

---

## ページ構成

### 公開ページ（認証不要）

#### `/` - トップページ
- 公開中のお知らせ一覧を表示
- 最新順にソート（publishedAt降順）
- ページネーション: 10件/ページ
- 各お知らせのカード表示:
  - サムネイル画像（あれば）
  - タイトル
  - 公開日時
  - 本文の抜粋（最大100文字）

#### `/news/[id]` - お知らせ詳細ページ
- お知らせの詳細情報を表示
- 画像（あれば）をフルサイズ表示
- マークダウンでレンダリングされた本文
- 公開日時
- 前後のお知らせへのナビゲーション

### 管理ページ（認証必要）

#### `/admin/login` - ログインページ
- メールアドレス入力フォーム
- パスワード入力フォーム
- ログインボタン
- エラーメッセージ表示

#### `/admin` - 管理ダッシュボード
- お知らせ一覧（下書き含む）
- ステータス別フィルター
- 検索機能（タイトル・本文）
- 各お知らせの操作:
  - 編集
  - 削除
  - プレビュー
  - 公開/下書きに戻す

#### `/admin/news/new` - お知らせ新規作成
- タイトル入力フォーム
- 本文入力フォーム（マークダウンエディタ）
- 画像アップロード
- プレビュー機能
- 保存ボタン（下書き保存）
- 公開ボタン（即座に公開）

#### `/admin/news/[id]/edit` - お知らせ編集
- 新規作成と同じフォーム
- 既存データの読み込み
- 画像の差し替え機能
- 画像の削除機能

---

## データベース設計（GraphQL Schema）

```graphql
enum NewsStatus {
  DRAFT
  PUBLISHED
}

type News @model @auth(rules: [
  { allow: owner, operations: [create, update, delete] }
  { allow: public, operations: [read], provider: iam }
]) {
  id: ID!
  title: String! @index(name: "byPublishedAt", sortKeyFields: ["publishedAt"], queryField: "listNewsByPublishedAt")
  content: String!
  imageUrl: String
  imageKey: String
  status: NewsStatus!
  publishedAt: AWSDateTime
  author: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### 認可ルール
- **作成・更新・削除**: 認証済みユーザー（owner）のみ
- **読み取り**: 全員（IAM認証を使用してパブリックアクセス）

---

## ストレージ設計（S3）

### バケット構成
```
aqua-cms-storage/
├── news-images/
│   ├── {newsId1}/
│   │   ├── {timestamp1}-{filename1}.jpg
│   │   └── {timestamp2}-{filename2}.png
│   └── {newsId2}/
│       └── {timestamp3}-{filename3}.jpg
└── public/
    └── (その他の公開ファイル)
```

### アクセス権限
```typescript
storage: defineStorage({
  name: 'aquaCmsStorage',
  access: (allow) => ({
    'news-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ]
  })
})
```

---

## UI/UX 要件

### デザインコンセプト
- **テーマ**: 水（AQUA）をイメージした爽やかなデザイン
- **カラーパレット**:
  - プライマリ: ブルー系（#0EA5E9, #0284C7）
  - セカンダリ: グリーン系（#10B981）
  - アクセント: オレンジ系（#F59E0B）
  - 背景: ホワイト・ライトグレー
- **フォント**: システムフォント（読みやすさ重視）

### レスポンシブ対応
- **モバイル**: 320px〜767px
- **タブレット**: 768px〜1023px
- **デスクトップ**: 1024px〜

### アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応（適切なARIAラベル）
- 十分なコントラスト比

---

## API エンドポイント（GraphQL）

### クエリ

#### 公開お知らせ一覧取得
```graphql
query ListPublishedNews($limit: Int, $nextToken: String) {
  listNewsByPublishedAt(
    status: PUBLISHED
    sortDirection: DESC
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      content
      imageUrl
      publishedAt
      author
    }
    nextToken
  }
}
```

#### お知らせ詳細取得
```graphql
query GetNews($id: ID!) {
  getNews(id: $id) {
    id
    title
    content
    imageUrl
    status
    publishedAt
    author
    createdAt
    updatedAt
  }
}
```

#### 管理者用お知らせ一覧取得
```graphql
query ListAllNews($filter: ModelNewsFilterInput, $limit: Int, $nextToken: String) {
  listNews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      status
      publishedAt
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

### ミューテーション

#### お知らせ作成
```graphql
mutation CreateNews($input: CreateNewsInput!) {
  createNews(input: $input) {
    id
    title
    content
    imageUrl
    imageKey
    status
    publishedAt
    author
    createdAt
  }
}
```

#### お知らせ更新
```graphql
mutation UpdateNews($input: UpdateNewsInput!) {
  updateNews(input: $input) {
    id
    title
    content
    imageUrl
    imageKey
    status
    publishedAt
    updatedAt
  }
}
```

#### お知らせ削除
```graphql
mutation DeleteNews($input: DeleteNewsInput!) {
  deleteNews(input: $input) {
    id
  }
}
```

---

## 開発フロー

### 1. 環境構築
```bash
# 依存パッケージインストール
npm install

# Amplifyサンドボックス起動
npx ampx sandbox --profile se
```

### 2. 開発サーバー起動
```bash
npm run dev
```

### 3. ビルド
```bash
npm run build
```

### 4. デプロイ
```bash
npx ampx pipeline-deploy --branch main --profile se
```

---

## セキュリティ要件

### 認証
- パスワードポリシー:
  - 最小長: 8文字
  - 大文字・小文字・数字・記号を含む
- MFA: オプション（将来的に実装可能）

### データ保護
- GraphQL APIはすべてHTTPS経由
- 機密情報のログ出力禁止
- CORS設定の適切な管理

### ファイルアップロード
- ファイルタイプ検証（MIMEタイプ）
- ファイルサイズ制限
- ウイルススキャン（将来的に検討）

---

## パフォーマンス要件

### ページロード時間
- 初期表示: 2秒以内
- ページ遷移: 1秒以内

### 画像最適化
- 遅延ロード（Lazy Loading）
- Next.js Imageコンポーネント使用
- WebP形式への変換推奨

### キャッシュ戦略
- 静的アセット: 1年間
- API レスポンス: 適切なキャッシュヘッダー

---

## テスト要件

### 単体テスト
- コンポーネント: React Testing Library
- ユーティリティ関数: Jest

### E2Eテスト
- 主要フロー: Playwright（将来的に実装）

### テストケース
1. ログイン/ログアウト
2. お知らせの作成・編集・削除
3. 画像アップロード
4. 公開/下書き切り替え
5. 一覧・詳細表示

---

## エラーハンドリング

### クライアントサイド
- フォームバリデーション
- API エラーの適切な表示
- ネットワークエラー処理

### サーバーサイド
- GraphQL エラーハンドリング
- 認証エラー（401）→ ログインページへリダイレクト
- 権限エラー（403）→ エラーページ表示
- 存在しないリソース（404）→ 404ページ表示

---

## 今後の拡張案

### Phase 2
- カテゴリ機能
- タグ機能
- 検索機能の強化
- コメント機能

### Phase 3
- 複数画像対応
- ファイル添付機能
- 下書きプレビューURL発行
- 公開予約機能

### Phase 4
- 多言語対応
- SEO最適化
- アナリティクス統合
- RSS フィード

---

## 付録

### 環境変数
```env
# 自動生成（amplify_outputs.json）
# 手動での環境変数設定は不要
```

### 推奨VSCode拡張機能
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GraphQL: Language Feature Support
- AWS Toolkit

---

## 変更履歴
| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2024-11-28 | 1.0.0 | 初版作成 | - |

