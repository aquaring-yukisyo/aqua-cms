export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-2xl font-bold text-primary-600">AQUA CMS</div>
          <p className="text-sm text-gray-600">
            簡易的なお知らせ管理システム
          </p>
          <p className="text-xs text-gray-500">
            © {currentYear} AQUA CMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

