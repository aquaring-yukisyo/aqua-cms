import { defineFunction } from "@aws-amplify/backend";

/**
 * 静的サイト再構築用のLambda関数
 */
export const rebuildSite = defineFunction({
  name: "rebuildSite",
  entry: "./rebuild-site-handler.ts",
  timeoutSeconds: 300,
  environment: {
    NEXT_BUILD_URL: process.env.NEXT_BUILD_URL || "",
  },
});

