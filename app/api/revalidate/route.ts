import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * サイト再構築API
 * 公開ページのキャッシュをクリアして再生成をトリガー
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 サイト再構築を開始...");
    
    // お知らせのキャッシュをクリア
    revalidateTag("news-list");
    revalidatePath("/", "layout");
    revalidatePath("/news/[id]", "page");
    console.log("✅ お知らせのキャッシュをクリア");
    
    // 実績のキャッシュをクリア
    revalidateTag("achievements-list");
    revalidatePath("/achievements", "page");
    revalidatePath("/achievements/[id]", "page");
    console.log("✅ 実績のキャッシュをクリア");

    return NextResponse.json({
      success: true,
      message: "サイトの再構築を開始しました（お知らせ・実績）",
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

