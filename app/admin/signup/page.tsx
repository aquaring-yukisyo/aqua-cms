"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, SignUpInput, confirmSignUp, ConfirmSignUpInput } from "aws-amplify/auth";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setLoading(false);
      return;
    }

    try {
      const signUpInput: SignUpInput = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      };

      await signUp(signUpInput);
      setStep("confirm");
      alert("確認コードをメールアドレスに送信しました");
    } catch (err) {
      console.error("Sign up error:", err);
      if (err instanceof Error) {
        if (err.message.includes("User already exists")) {
          setError("このメールアドレスは既に登録されています");
        } else if (err.message.includes("Password did not conform")) {
          setError(
            "パスワードは大文字、小文字、数字、記号を含む8文字以上で設定してください"
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("アカウントの作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const confirmSignUpInput: ConfirmSignUpInput = {
        username: email,
        confirmationCode,
      };

      await confirmSignUp(confirmSignUpInput);
      alert("アカウントが作成されました！ログインしてください");
      router.push("/admin/login");
    } catch (err) {
      console.error("Confirmation error:", err);
      if (err instanceof Error) {
        if (err.message.includes("Invalid verification code")) {
          setError("確認コードが正しくありません");
        } else {
          setError(err.message);
        }
      } else {
        setError("確認に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-md w-full">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            AQUA CMS
          </h1>
          <p className="text-gray-600">管理者アカウント作成</p>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  アカウント作成
                </h2>
                <p className="text-sm text-gray-600">
                  管理者アカウントを作成します
                </p>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>

              {/* パスワード */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  8文字以上、大文字・小文字・数字・記号を含む
                </p>
              </div>

              {/* パスワード確認 */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  パスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* 作成ボタン */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    作成中...
                  </span>
                ) : (
                  "アカウント作成"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  メール確認
                </h2>
                <p className="text-sm text-gray-600">
                  {email} に送信された確認コードを入力してください
                </p>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* 確認コード */}
              <div>
                <label
                  htmlFor="confirmationCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  確認コード
                </label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {/* 確認ボタン */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "確認中..." : "確認"}
              </button>

              {/* 戻るボタン */}
              <button
                type="button"
                onClick={() => setStep("signup")}
                disabled={loading}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                戻る
              </button>
            </form>
          )}

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちですか？{" "}
              <Link
                href="/admin/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ログイン
              </Link>
            </p>
          </div>
        </div>

        {/* トップに戻る */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

