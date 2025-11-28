"use client";

import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";
import outputs from "@/amplify_outputs.json";

// Cookieストレージの設定を最適化（HTTP 431エラー対策）
cognitoUserPoolsTokenProvider.setKeyValueStorage(
  new CookieStorage({
    domain: typeof window !== "undefined" ? window.location.hostname : "",
    path: "/",
    expires: 30, // 30日間
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
);

// Amplifyの設定を行う（SSR対応）
Amplify.configure(outputs, { 
  ssr: true,
});

export const AmplifyConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

