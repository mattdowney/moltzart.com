import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename");

  if (!blobUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const downloadUrl = await getDownloadUrl(blobUrl);

    return NextResponse.redirect(downloadUrl, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename || "download"}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Download error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
