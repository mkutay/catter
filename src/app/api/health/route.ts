import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    'Health check succeeded.',
    { status: 200 }
  );
}