import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * AQUA CMS - 管理者認証用の設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
  },
});
