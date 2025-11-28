type ErrorMessageProps = {
  message: string;
  retry?: () => void;
};

export const ErrorMessage = ({ message, retry }: ErrorMessageProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-2">
              エラーが発生しました
            </h3>
            <p className="text-red-700 text-sm">{message}</p>
            {retry && (
              <button
                onClick={retry}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                再試行
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

