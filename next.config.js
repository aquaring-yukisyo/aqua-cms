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
};

module.exports = nextConfig;
