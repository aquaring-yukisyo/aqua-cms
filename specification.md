# AQUA CMS 仕様書

## プロジェクト概要
簡易的なお知らせ・実績管理システム（CMS）
- 管理者はお知らせ・実績の作成・編集・削除が可能
- 一般ユーザーはお知らせ・実績の閲覧のみ可能（認証不要）
- 画像アップロード機能を含む
- 会社情報ページを含む

## 技術スタック
- **フロントエンド**: Next.js 15.1.3 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS 3.4
- **マークダウン**: react-markdown, remark-gfm
- **日付処理**: date-fns 3.0
- **バックエンド**: AWS Amplify Gen2
- **認証**: Amazon Cognito (Amplify Auth)
- **データベース**: AWS AppSync (GraphQL)
- **ストレージ**: Amazon S3 (Amplify Storage)
- **Lambda**: 再構築用関数
- **プロファイル**: se

---

## 機能要件

### 1. 認証機能
#### 管理者認証
- **ログイン方法**: メールアドレス + パスワード
- **認証プロバイダー**: Amazon Cognito
- **ログインページ**: `/admin/login`
- **サインアップページ**: `/admin/signup`
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
| title | String | ○ | お知らせのタイトル |
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

### 3. 実績機能

#### データモデル: Achievement
| フィールド名 | 型 | 必須 | 説明 |
|------------|-----|-----|------|
| id | ID | ○ | 自動生成される一意のID |
| title | String | ○ | 実績のタイトル |
| description | String | ○ | 実績の説明（マークダウン対応） |
| imageUrl | String | × | アップロードした画像のURL |
| imageKey | String | × | S3の画像キー（削除用） |
| category | String | × | カテゴリ（例：Web制作、アプリ開発） |
| client | String | × | クライアント名 |
| url | String | × | プロジェクトURL |
| status | Enum | ○ | 公開状態（DRAFT, PUBLISHED） |
| publishedAt | AWSDateTime | × | 公開日時 |
| createdAt | AWSDateTime | ○ | 作成日時（自動生成） |
| updatedAt | AWSDateTime | ○ | 更新日時（自動生成） |
| author | String | ○ | 作成者のメールアドレス |

### 4. 画像アップロード機能
- **アップロード先**: Amazon S3 (Amplify Storage)
- **対応フォーマット**: JPEG, PNG, GIF, WebP
- **最大ファイルサイズ**: 5MB
- **画像最適化**: クライアントサイドでリサイズ（最大幅: 1200px）
- **保存パス**: `public/news-images/{filename}`
- **権限**:
  - アップロード: 認証ユーザーのみ
  - 閲覧: 全員（パブリック読み取り）

### 5. 再構築機能
- **目的**: 公開ページの静的ファイルを更新
- **トリガー**: 管理画面のボタンから手動実行
- **実装**: Next.jsのrevalidateTag機能
- **対象タグ**:
  - `news-list`: お知らせ一覧
  - `news-detail`: お知らせ詳細
  - `achievements-list`: 実績一覧
  - `achievements-detail`: 実績詳細

---

## ページ構成

### 公開ページ（認証不要）

#### `/` - トップページ（お知らせ一覧）
- 公開中のお知らせ一覧を表示
- 最新順にソート（publishedAt降順）
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

#### `/achievements` - 実績一覧ページ
- 公開中の実績一覧を表示
- 最新順にソート（publishedAt降順）
- グリッドレイアウト（3列）
- 各実績のカード表示:
  - サムネイル画像（あれば）
  - カテゴリバッジ
  - タイトル
  - クライアント名
  - 説明の抜粋

#### `/achievements/[id]` - 実績詳細ページ
- 実績の詳細情報を表示
- 画像（あれば）をフルサイズ表示
- マークダウンでレンダリングされた説明
- カテゴリ、クライアント名、プロジェクトURL

#### `/company` - 会社情報ページ
- 企業理念（Oneness for good design.）
- 3つの価値観:
  - いいモノをつくる
  - チームの力を信じる
  - 理想へ背伸びをする
- 会社概要（テーブル形式）
- 役員紹介
- アクセス情報

### 管理ページ（認証必要）

#### `/admin/login` - ログインページ
- メールアドレス入力フォーム
- パスワード入力フォーム
- ログインボタン
- サインアップへのリンク
- エラーメッセージ表示

#### `/admin/signup` - サインアップページ
- 新規管理者登録

#### `/admin` - 管理ダッシュボード
- **お知らせ/実績タブ切り替え**
- **再構築ボタン**: 公開サイトの更新
- ステータス別フィルター（すべて、公開中、下書き）
- 各アイテムの操作:
  - 編集
  - 削除
  - 公開/下書きに戻す

#### `/admin/news/new` - お知らせ新規作成
- タイトル入力フォーム
- 本文入力フォーム（マークダウンエディタ）
- 画像アップロード
- 保存ボタン（下書き保存）
- 公開ボタン（即座に公開）

#### `/admin/news/[id]/edit` - お知らせ編集
- 新規作成と同じフォーム
- 既存データの読み込み
- 画像の差し替え機能
- 画像の削除機能

#### `/admin/achievements/new` - 実績新規作成
- タイトル入力フォーム
- 説明入力フォーム（マークダウンエディタ）
- カテゴリ入力
- クライアント名入力
- プロジェクトURL入力
- 画像アップロード
- 保存/公開ボタン

#### `/admin/achievements/[id]/edit` - 実績編集
- 新規作成と同じフォーム
- 既存データの読み込み

#### `/api/revalidate` - 再構築API
- POSTメソッドで呼び出し
- タグベースのキャッシュクリア

---

## データベース設計（GraphQL Schema）

```typescript
// amplify/data/resource.ts
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
      category: a.string(),
      client: a.string(),
      url: a.string(),
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
```

### 認可ルール
- **作成・更新・削除**: 認証済みユーザーのみ
- **読み取り**: 全員（API Key認証を使用してパブリックアクセス）

### 認証モード
- **デフォルト**: apiKey（ゲストアクセス用）
- **API Key有効期限**: 30日

---

## ストレージ設計（S3）

### バケット構成
```
aquaCmsStorage/
└── public/
    ├── news-images/
    │   ├── {timestamp1}-{filename1}.jpg
    │   └── {timestamp2}-{filename2}.png
    └── (その他の公開ファイル)
```

### アクセス権限
```typescript
// amplify/storage/resource.ts
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
```

### パブリックアクセス設定
- S3バケットのパブリックリードアクセスを有効化
- バケットポリシーで`public/*`パスへのGetObjectを許可

---

## Lambda関数

### rebuild-site（再構築用）
- **目的**: Amplify Hostingの再デプロイをトリガー
- **タイムアウト**: 300秒
- **環境変数**: NEXT_BUILD_URL
- **トリガー**: 管理画面からの手動実行

---

## コンポーネント構成

### 共通コンポーネント
| コンポーネント | 説明 |
|--------------|------|
| Header | 公開ページ用ヘッダー（ナビゲーション含む） |
| AdminHeader | 管理画面用ヘッダー |
| Footer | フッター |
| AuthGuard | 認証ガード |
| Loading | ローディング表示 |
| ErrorMessage | エラーメッセージ表示 |
| ImageUpload | 画像アップロード |
| MarkdownEditor | マークダウンエディタ |
| RebuildButton | 再構築ボタン |
| AmplifyConfigProvider | Amplify設定プロバイダー |

### カスタムフック
| フック | 説明 |
|-------|------|
| useAuth | 認証状態管理 |

### ユーティリティ
| ファイル | 説明 |
|---------|------|
| amplify-client.ts | Amplifyクライアント設定 |
| date-utils.ts | 日付フォーマット関数 |
| utils.ts | 汎用ユーティリティ（truncateText, stripMarkdownなど） |

---

## UI/UX 要件

### デザインコンセプト
- **テーマ**: 水（AQUA）をイメージした爽やかなデザイン
- **カラーパレット**:
  - プライマリ: ブルー系（primary-500〜700）
  - セカンダリ: グリーン系（secondary-500〜700）
  - アクセント: オレンジ/アンバー系（accent-500〜700）
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
query ListNewsByStatus {
  listNewsByStatus(status: PUBLISHED, limit: 100, sortDirection: DESC) {
    items {
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
}
```

#### 公開実績一覧取得
```graphql
query ListAchievementsByStatus {
  listAchievementsByStatus(status: PUBLISHED, limit: 100, sortDirection: DESC) {
    items {
      id
      title
      description
      imageUrl
      category
      client
      url
      status
      publishedAt
      author
      createdAt
      updatedAt
    }
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
- API レスポンス: revalidateTagによるオンデマンド再検証
- 公開ページ: `force-dynamic`で常に最新データ取得

---

## ファイル構成

```
aqua-cms/
├── amplify/
│   ├── auth/
│   │   └── resource.ts          # 認証設定
│   ├── data/
│   │   └── resource.ts          # GraphQLスキーマ
│   ├── storage/
│   │   └── resource.ts          # S3ストレージ設定
│   ├── functions/
│   │   └── rebuild-site/
│   │       ├── resource.ts      # Lambda関数定義
│   │       └── rebuild-site-handler.ts
│   ├── backend.ts               # バックエンド統合
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── achievements/
│   │   ├── [id]/
│   │   │   └── page.tsx         # 実績詳細
│   │   └── page.tsx             # 実績一覧
│   ├── admin/
│   │   ├── achievements/
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx # 実績編集
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # 実績新規作成
│   │   │   └── page.tsx         # 実績管理
│   │   ├── login/
│   │   │   └── page.tsx         # ログイン
│   │   ├── news/
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx # お知らせ編集
│   │   │   └── new/
│   │   │       └── page.tsx     # お知らせ新規作成
│   │   ├── signup/
│   │   │   └── page.tsx         # サインアップ
│   │   └── page.tsx             # ダッシュボード
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts         # 再構築API
│   ├── company/
│   │   └── page.tsx             # 会社情報
│   ├── components/
│   │   ├── AdminHeader.tsx
│   │   ├── AmplifyConfigProvider.tsx
│   │   ├── AuthGuard.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Loading.tsx
│   │   ├── MarkdownEditor.tsx
│   │   └── RebuildButton.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── amplify-client.ts
│   │   ├── date-utils.ts
│   │   └── utils.ts
│   ├── news/
│   │   └── [id]/
│   │       └── page.tsx         # お知らせ詳細
│   ├── layout.tsx
│   ├── page.tsx                 # トップページ
│   ├── globals.css
│   └── app.css
├── public/
├── amplify_outputs.json         # 自動生成
├── amplify.yml                  # CI/CD設定
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## 依存パッケージ

### 本番依存
```json
{
  "@aws-amplify/ui-react": "^6.5.5",
  "aws-amplify": "^6.6.6",
  "next": "15.1.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0",
  "date-fns": "^3.0.0"
}
```

### 開発依存
```json
{
  "@aws-amplify/backend": "^1.5.1",
  "@aws-amplify/backend-cli": "^1.3.0",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "aws-cdk": "^2",
  "aws-cdk-lib": "^2",
  "constructs": "^10.3.0",
  "esbuild": "^0.23.1",
  "tsx": "^4.19.0",
  "typescript": "^5.6.2",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.32",
  "autoprefixer": "^10.4.16",
  "@tailwindcss/typography": "^0.5.10"
}
```

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
| 2024-12-18 | 2.0.0 | 実績機能・会社情報・再構築機能追加、認可方式変更 | - |
