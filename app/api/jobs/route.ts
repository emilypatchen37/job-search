import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { fetchAllJobs } from '@/lib/adzuna'
import { MOCK_JOBS } from '@/lib/mock'

const getCachedJobs = unstable_cache(
  fetchAllJobs,
  ['all-jobs'],
  { tags: ['jobs'], revalidate: 86400 }
)

export async function GET() {
  const hasKeys = !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY)
  const jobs = hasKeys ? await getCachedJobs() : MOCK_JOBS
  return NextResponse.json({
    jobs,
    is_mock: !hasKeys,
    refreshed_at: new Date().toISOString(),
  })
}
