import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * サイト再構築API
 * 公開ページのキャッシュをクリアして再生成をトリガー
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 サイト再構築を開始...");
    
    // トップページ（お知らせ一覧）のキャッシュをクリア
    revalidatePath("/");
    console.log("✅ トップページのキャッシュをクリア");
    
    // お知らせのキャッシュをクリア
    revalidatePath("/news/[id]", "page");
    console.log("✅ お知らせ詳細のキャッシュをクリア");
    
    // 実績のキャッシュをクリア
    revalidatePath("/achievements", "page");
    revalidatePath("/achievements/[id]", "page");
    console.log("✅ 実績のキャッシュをクリア");
    
    // 会社情報のキャッシュをクリア
    revalidatePath("/company", "page");
    console.log("✅ 会社情報のキャッシュをクリア");

    return NextResponse.json({
      success: true,
      message: "サイトの再構築を完了しました",
      revalidated: true,
      now: Date.now(),
      revalidatedPaths: [
        "/",
        "/news/[id]",
        "/achievements",
        "/achievements/[id]",
        "/company"
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

