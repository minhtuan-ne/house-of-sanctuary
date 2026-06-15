import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`writing/${filename}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  }

  // Local dev: write to public/uploads/
  const { writeFile } = await import("fs/promises");
  const { join } = await import("path");
  const bytes = await file.arrayBuffer();
  const dest = join(process.cwd(), "public", "uploads", filename);
  await writeFile(dest, Buffer.from(bytes));
  return NextResponse.json({ url: `/uploads/${filename}` });
}
