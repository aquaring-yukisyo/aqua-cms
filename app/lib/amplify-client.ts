import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// 型安全なクライアントを作成
export const client = generateClient<Schema>();

