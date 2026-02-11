import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchDraftsRaw, updateDraftsFile } from "@/lib/github";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token && token === process.env.TASKS_PASSWORD;
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { draftId, action } = await request.json();

  if (!draftId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Fetch current file
  const raw = await fetchDraftsRaw();
  if (!raw) {
    return NextResponse.json({ error: "Could not fetch drafts file" }, { status: 500 });
  }

  // Parse the draftId to find the draft: format is "DATE-TYPE-TARGET-INDEX"
  const parts = draftId.split("-");
  const date = parts.slice(0, 3).join("-"); // "2026-02-11"
  const type = parts[3]; // "original" or "reply"
  const target = parts.slice(4, -1).join("-"); // reply target or "original"

  // Find the draft in the content by looking for the blockquote
  // We'll mark it by moving it between sections
  let { content, sha } = raw;
  const lines = content.split("\n");
  let found = false;
  let inPendingSection = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^## Pending Approval/i)) {
      inPendingSection = true;
      continue;
    }
    if (lines[i].match(/^## /) && inPendingSection) {
      inPendingSection = false;
    }

    // Look for entries in Pending section that match our date and aren't already rejected
    if (inPendingSection && lines[i].startsWith("**") && lines[i].includes(date)) {
      // Check if this is already rejected (has ❌)
      if (lines[i].includes("❌ REJECTED")) continue;

      // Check type match
      const isReply = lines[i].toLowerCase().includes("reply");
      const isOriginal = lines[i].toLowerCase().includes("original");

      if ((type === "reply" && isReply && (target === "original" || lines[i].toLowerCase().includes(target))) ||
          (type === "original" && isOriginal)) {

        if (action === "approve") {
          // Add ✅ marker
          lines[i] = lines[i].replace(/\*\*\s*$/, " ✅**");
          if (!lines[i].endsWith("**")) lines[i] += " ✅";
        } else {
          // Add ❌ REJECTED marker
          lines[i] = lines[i].replace(/\*\*\s*$/, " ❌ REJECTED**");
          if (!lines[i].endsWith("**")) lines[i] += " ❌ REJECTED";
        }
        found = true;
        break;
      }
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Draft not found in pending section" }, { status: 404 });
  }

  const newContent = lines.join("\n");
  const actionLabel = action === "approve" ? "Approve" : "Reject";
  const ok = await updateDraftsFile(newContent, sha, `${actionLabel} draft: ${draftId}`);

  if (!ok) {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
