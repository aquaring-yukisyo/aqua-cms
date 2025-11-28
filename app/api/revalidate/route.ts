import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * サイト再構築API
 * タグベースのオンデマンド再検証で静的ページを更新
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 サイト再構築を開始...");
    
    // お知らせのタグを再検証
    revalidateTag('news-list');
    revalidateTag('news-detail');
    console.log("✅ お知らせのキャッシュをクリア");
    
    // 実績のタグを再検証
    revalidateTag('achievements-list');
    revalidateTag('achievements-detail');
    console.log("✅ 実績のキャッシュをクリア");

    return NextResponse.json({
      success: true,
      message: "サイトの再構築を完了しました",
      revalidated: true,
      now: Date.now(),
      revalidatedTags: [
        'news-list',
        'news-detail',
        'achievements-list',
        'achievements-detail',
      ],
    });
  } catch (error) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "再構築に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GETリクエストも対応（テスト用）
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "再構築APIです。POSTメソッドでリクエストしてください。",
  });
}

