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
  
  // 静的エクスポートは無効（ISRを使用するため）
  // output: 'export',
  
  // HTTP 431エラー対策 - ヘッダーサイズ制限を増やす
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // カスタムヘッダー設定
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
