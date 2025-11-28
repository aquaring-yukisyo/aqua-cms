import type { Metadata } from "next";
import "./globals.css";
import { AmplifyConfigProvider } from "./components/AmplifyConfigProvider";

export const metadata: Metadata = {
  title: "AQUA CMS - お知らせ管理システム",
  description: "簡易的なお知らせ管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <AmplifyConfigProvider>{children}</AmplifyConfigProvider>
      </body>
    </html>
  );
}
