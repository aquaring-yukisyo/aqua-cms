import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">
              AQUA CMS
            </div>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              お知らせ
            </Link>
            <Link
              href="/company"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              会社情報
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              管理画面
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

