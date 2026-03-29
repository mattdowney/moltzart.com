import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "download";

  if (!blobUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    // Verify the blob exists and get metadata
    const blobMeta = await head(blobUrl);

    // Fetch the blob content server-side using the token
    const res = await fetch(blobMeta.downloadUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!res.ok) {
      // If token auth doesn't work, try fetching with the blob URL directly
      // (server-side fetch from Vercel infra can access private blobs)
      const directRes = await fetch(blobUrl, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });

      if (!directRes.ok) {
        return NextResponse.json(
          { error: `Blob fetch failed: ${directRes.status}` },
          { status: 500 }
        );
      }

      const body = directRes.body;
      return new NextResponse(body, {
        headers: {
          "Content-Type": blobMeta.contentType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(blobMeta.size),
        },
      });
    }

    const body = res.body;
    return new NextResponse(body, {
      headers: {
        "Content-Type": blobMeta.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(blobMeta.size),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Download error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
