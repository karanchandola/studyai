// app/api/textextract/route.js

export const runtime = 'nodejs'; // Force Node.js runtime

import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const extractedText = data.text;

    return NextResponse.json(
      { extractedText, status: 200 }
    );
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('GET request received at /api/textextract');
  return NextResponse.json({ message: 'API is working!' }, { status: 200 });
}
