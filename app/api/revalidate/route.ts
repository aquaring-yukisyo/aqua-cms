import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * サイト再構築API
 * 公開ページのキャッシュをクリアして再生成をトリガー
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 サイト再構築を開始...");
    
    // トップページを再検証（タグベース）
    revalidateTag("news-list");
    console.log("✅ トップページのキャッシュをクリア");
    
    // すべてのニュース詳細ページを再検証（パスベース）
    revalidatePath("/", "layout");
    revalidatePath("/news/[id]", "page");
    console.log("✅ お知らせ詳細ページのキャッシュをクリア");

    return NextResponse.json({
      success: true,
      message: "サイトの再構築を開始しました",
      revalidated: true,
      now: Date.now(),
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

