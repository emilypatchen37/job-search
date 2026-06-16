import { Job, RoleType, Sector } from './types'
import { scoreJob } from './scorer'

const SEARCHES: Array<{ query: string; roleType: RoleType }> = [
  { query: 'technical program manager',    roleType: 'Technical Program Manager' },
  { query: 'solutions engineer',           roleType: 'Solutions Engineer' },
  { query: 'associate product manager',    roleType: 'Associate Product Manager' },
  { query: 'customer success engineer',    roleType: 'Customer Success Engineer' },
  { query: 'implementation manager',       roleType: 'Implementation Manager' },
  { query: 'product operations manager',   roleType: 'Product Operations' },
  { query: 'technical account manager',    roleType: 'Technical Account Manager' },
  { query: 'forward deployed engineer',    roleType: 'Forward Deployed Engineer' },
  { query: 'solutions consultant',         roleType: 'Solutions Consultant' },
]

const BAD_FIT = [
  'senior backend engineer', 'staff engineer', 'principal engineer', 'devops engineer',
  'site reliability', 'data engineer', 'machine learning engineer', 'platform engineer',
  'infrastructure engineer', 'network engineer', 'embedded engineer',
]

const BIG_CORP = [
  'goldman sachs', 'jpmorgan', 'morgan stanley', 'citibank', 'bank of america',
  'mckinsey', 'deloitte', 'kpmg', 'pwc', 'accenture', 'ibm', 'oracle',
  'mastercard', 'visa', 'american express', 'wells fargo',
]

function detectSector(text: string): Sector {
  const t = text.toLowerCase()
  if (/\bai\b|artificial intelligence|large language|llm|gpt|generative/.test(t)) return 'AI'
  if (/fintech|payment|banking|lending|credit|insurance|wealth/.test(t)) return 'Fintech'
  if (/health|medical|clinical|patient|care|pharma|biotech|mental health/.test(t)) return 'HealthTech'
  if (/edtech|education|learning|curriculum|school|university/.test(t)) return 'EdTech'
  if (/hr|human resources|talent|recruiting|payroll|workforce|compensation/.test(t)) return 'HRTech'
  return 'B2B SaaS'
}

function isBadFit(title: string, company: string): boolean {
  const t = title.toLowerCase()
  const c = company.toLowerCase()
  if (BAD_FIT.some(b => t.includes(b))) return true
  if (BIG_CORP.some(b => c.includes(b))) return true
  return false
}

interface AdzunaJob {
  id: string
  title: string
  description: string
  company: { display_name: string }
  location: { display_name: string }
  salary_min?: number
  salary_max?: number
  created: string
  redirect_url: string
}

async function searchAdzuna(query: string, roleType: RoleType): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return []

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: '15',
    what: query,
    where: 'New York',
    sort_by: 'date',
    max_days_old: '14',
  })

  try {
    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?${params}`,
      { next: { tags: ['jobs'], revalidate: 86400 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const results: AdzunaJob[] = data.results || []

    const now = new Date()
    return results
      .filter(r => !isBadFit(r.title, r.company.display_name))
      .map(r => {
        const postedAt = new Date(r.created)
        const hoursSince = (now.getTime() - postedAt.getTime()) / 3_600_000
        const combined = r.company.display_name + ' ' + r.description
        return {
          id: r.id,
          title: r.title,
          company: r.company.display_name,
          location: r.location.display_name,
          description: r.description,
          salary_min: r.salary_min,
          salary_max: r.salary_max,
          url: r.redirect_url,
          posted_at: r.created,
          role_type: roleType,
          sector: detectSector(combined),
          scores: scoreJob(r.title, r.description, roleType),
          is_new: hoursSince <= 24,
        }
      })
  } catch {
    return []
  }
}

export async function fetchAllJobs(): Promise<Job[]> {
  const batches = await Promise.all(
    SEARCHES.map(s => searchAdzuna(s.query, s.roleType))
  )

  const seen = new Set<string>()
  const jobs: Job[] = []
  for (const batch of batches) {
    for (const job of batch) {
      if (!seen.has(job.id)) {
        seen.add(job.id)
        jobs.push(job)
      }
    }
  }

  return jobs.sort((a, b) => {
    if (a.is_new !== b.is_new) return a.is_new ? -1 : 1
    const aScore = a.scores.technical_fit + a.scores.comm_fit + a.scores.growth
    const bScore = b.scores.technical_fit + b.scores.comm_fit + b.scores.growth
    return bScore - aScore
  })
}
