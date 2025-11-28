"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/app/hooks/useAuth";

export const AdminHeader = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">
                AQUA CMS
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-accent-100 text-accent-800 rounded">
                管理画面
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                ダッシュボード
              </Link>
              <Link
                href="/admin/news/new"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                新規作成
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600 hidden md:block">
                {user.signInDetails?.loginId}
              </span>
            )}
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              公開ページ
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

