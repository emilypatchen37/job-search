import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Called daily by Vercel cron (vercel.json) to refresh job listings
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const expected = process.env.CRON_SECRET
  if (expected && secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidateTag('jobs')
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}
