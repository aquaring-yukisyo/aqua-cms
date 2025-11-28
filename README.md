# AQUA CMS

簡易的なお知らせ管理システム（CMS）

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: AWS Amplify Gen2
- **認証**: Amazon Cognito
- **データベース**: AWS AppSync (GraphQL)
- **ストレージ**: Amazon S3

## 機能

### 公開機能（認証不要）
- お知らせ一覧表示
- お知らせ詳細表示
- マークダウン形式の本文表示
- 画像表示

### 管理機能（認証必要）
- お知らせの作成・編集・削除
- 画像アップロード（最大5MB）
- マークダウンエディタ
- 公開/下書き管理
- プレビュー機能

## セットアップ

### 前提条件
- Node.js 18以上
- AWS アカウント
- AWS CLI設定（プロファイル: se）

### インストール

```bash
# 依存パッケージのインストール
npm install

# Amplify サンドボックスの起動
npm run sandbox

# または一度だけ実行
npx ampx sandbox --once --profile se
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構成

```
aqua-cms/
├── amplify/                  # Amplify Gen2 バックエンド定義
│   ├── auth/                # 認証設定
│   ├── data/                # GraphQLスキーマ
│   ├── storage/             # S3ストレージ設定
│   └── backend.ts           # バックエンド統合
├── app/                     # Next.js App Router
│   ├── components/          # 共通コンポーネント
│   ├── hooks/               # カスタムフック
│   ├── lib/                 # ユーティリティ
│   ├── admin/               # 管理画面
│   │   ├── login/          # ログインページ
│   │   └── news/           # お知らせ管理
│   ├── news/               # お知らせ公開ページ
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # トップページ
├── specification.md         # 仕様書
└── package.json
```

## 主要コンポーネント

### 認証関連
- `AuthGuard`: 認証ガード
- `useAuth`: 認証状態フック

### 共通UI
- `Header`: ヘッダー
- `Footer`: フッター
- `AdminHeader`: 管理画面ヘッダー
- `Loading`: ローディング表示
- `ErrorMessage`: エラーメッセージ

### 機能コンポーネント
- `ImageUpload`: 画像アップロード
- `MarkdownEditor`: マークダウンエディタ

## データモデル

### News
- `title`: タイトル（必須）
- `content`: 本文（必須、マークダウン）
- `imageUrl`: 画像URL
- `imageKey`: S3キー
- `status`: ステータス（DRAFT | PUBLISHED）
- `publishedAt`: 公開日時
- `author`: 作成者

## デプロイ

```bash
# 本番環境へのデプロイ
npm run deploy
```

## 初期ユーザー作成

Amplify サンドボックス起動後、AWS Cognito コンソールから管理者ユーザーを手動で作成してください。

1. AWS コンソール → Cognito
2. 該当のユーザープール選択
3. ユーザーを作成
4. メールアドレスとパスワードを設定

## 開発ガイドライン

### コーディング規約
- TypeScript厳格モード使用
- 関数コンポーネント使用
- 早期リターンパターン
- Tailwind CSSでスタイリング
- わかりやすい変数名・関数名

### Git ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発

## トラブルシューティング

### Amplify サンドボックスが起動しない
```bash
# サンドボックスを削除して再起動
npx ampx sandbox delete --profile se
npx ampx sandbox --profile se
```

### 認証エラー
- AWS CLIの設定を確認
- プロファイル名が正しいか確認

### 画像がアップロードできない
- S3バケットのCORS設定を確認
- ファイルサイズ（5MB以下）を確認
- ファイル形式（JPEG, PNG, GIF, WebP）を確認

## ライセンス

MIT

## 作成者

AQUA CMS Development Team
