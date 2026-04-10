import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), ".cursor", "debug-710836.log");

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { sessionId?: string };
    if (body?.sessionId !== "710836") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, `${JSON.stringify(body)}\n`, "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
