import { NextResponse } from "next/server";
import { extractJobFields } from "@/lib/job-extraction";
import { requireUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  await requireUser();

  const body = (await request.json()) as { document?: string };
  const documentText = body.document?.trim();

  if (!documentText) {
    return NextResponse.json({ error: "Document text is required." }, { status: 400 });
  }

  const result = await extractJobFields(documentText);
  return NextResponse.json(result);
}
