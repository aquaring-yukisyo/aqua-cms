"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

// Amplifyの設定を行う
Amplify.configure(outputs, { ssr: true });

export const AmplifyConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

