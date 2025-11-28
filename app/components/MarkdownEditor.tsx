"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          本文（マークダウン形式）
        </label>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            編集
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            プレビュー
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {activeTab === "edit" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
            placeholder="マークダウン形式でお知らせの本文を入力してください...

例：
# 見出し1
## 見出し2

**太字** *イタリック*

- リスト項目1
- リスト項目2

[リンク](https://example.com)"
          />
        ) : (
          <div className="p-4 min-h-[500px] bg-gray-50">
            {value ? (
              <div className="markdown-content prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                プレビューする内容がありません
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center text-xs text-gray-500 space-x-4">
        <span>マークダウン記法をサポートしています</span>
        <span>•</span>
        <span>文字数: {value.length}</span>
      </div>
    </div>
  );
};

