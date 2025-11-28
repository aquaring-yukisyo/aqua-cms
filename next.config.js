/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  // Amplify Gen2サポート
  transpilePackages: ['@aws-amplify/ui-react'],
  // 静的エクスポートの準備（将来的に有効化可能）
  // output: 'export',
  
  // HTTP 431エラー対策 - ヘッダーサイズ制限を増やす
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // カスタムサーバー設定（開発環境用）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Large-Header-Support',
            value: 'true',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
