import type { Handler } from "aws-lambda";

/**
 * 静的サイト再構築ハンドラー
 * 管理画面から呼び出されて静的ファイルを生成
 */
export const handler: Handler = async (event) => {
  console.log("Rebuild site triggered", event);

  try {
    // ここで静的サイト生成をトリガー
    // 実際の実装では、Next.jsのビルドプロセスを起動するか、
    // Amplify Hostingの再デプロイをトリガーします
    
    const buildUrl = process.env.NEXT_BUILD_URL;
    
    if (buildUrl) {
      // Webhook URLにリクエストを送信してビルドをトリガー
      const response = await fetch(buildUrl, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Build trigger failed: ${response.statusText}`);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "サイトの再構築を開始しました",
          success: true,
        }),
      };
    }

    // ローカル開発環境の場合
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "再構築リクエストを受け付けました（開発モード）",
        success: true,
      }),
    };
  } catch (error) {
    console.error("Rebuild error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "再構築に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
    };
  }
};

