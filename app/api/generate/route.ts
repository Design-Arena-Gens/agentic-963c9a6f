import { NextResponse } from 'next/server';
import { generateContent, type GenerateInput } from '@/lib/generator';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateInput;
    const result = generateContent({
      ...body,
      destination: body.destination?.trim() ?? '',
      variants: body.variants ?? 3,
      includeHashtags: body.includeHashtags ?? true,
      includeEmojis: body.includeEmojis ?? true,
      length: body.length ?? 'medium'
    });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Unknown error' }, { status: 400 });
  }
}
