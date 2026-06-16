'use client'

import { useState, useEffect, useCallback } from 'react'
import { Job, JobStatus, RoleType, Sector } from '@/lib/types'
import JobCard from './JobCard'
import JobModal from './JobModal'
import FilterBar from './FilterBar'

function timeLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>({})

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleType | 'All'>('All')
  const [sectorFilter, setSectorFilter] = useState<Sector | 'All'>('All')
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'score' | 'salary'>('newest')
  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('job-statuses')
    if (saved) {
      try { setStatuses(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => {
        setJobs(data.jobs || [])
        setIsMock(data.is_mock || false)
        setRefreshedAt(data.refreshed_at || null)
      })
      .catch(() => setError('Failed to load jobs. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const setJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setStatuses(prev => {
      const next = { ...prev, [jobId]: status }
      localStorage.setItem('job-statuses', JSON.stringify(next))
      return next
    })
  }, [])

  const filtered = jobs
    .filter(job => {
      if (!showHidden && statuses[job.id] === 'hidden') return false
      if (roleFilter !== 'All' && job.role_type !== roleFilter) return false
      if (sectorFilter !== 'All' && job.sector !== sectorFilter) return false
      if (timeFilter === 'today' && !job.is_new) return false
      if (timeFilter === 'week') {
        const weekAgo = Date.now() - 7 * 24 * 3_600_000
        if (new Date(job.posted_at).getTime() < weekAgo) return false
      }
      if (search) {
        const q = search.toLowerCase()
        if (
          !job.title.toLowerCase().includes(q) &&
          !job.company.toLowerCase().includes(q) &&
          !job.description.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      }
      if (sortBy === 'score') {
        const aS = a.scores.technical_fit + a.scores.comm_fit + a.scores.growth
        const bS = b.scores.technical_fit + b.scores.comm_fit + b.scores.growth
        return bS - aS
      }
      return (b.salary_max || 0) - (a.salary_max || 0)
    })

  const newToday = jobs.filter(j => j.is_new && statuses[j.id] !== 'hidden').length
  const savedCount = Object.values(statuses).filter(s => s === 'saved').length
  const appliedCount = Object.values(statuses).filter(s => s === 'applied').length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Emily&rsquo;s Job Board
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                NYC startups · No coding tests · Updated daily
              </p>
            </div>
            <div className="flex gap-4 text-right shrink-0">
              <div>
                <div className="text-lg font-bold text-green-400">{newToday}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-600">New today</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">{savedCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-600">Saved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-300">{appliedCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-600">Applied</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-300">{jobs.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-600">Total</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mock data banner */}
        {isMock && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-sm text-amber-300">
            <strong>Demo mode</strong> — showing sample jobs. Add your{' '}
            <a
              href="https://developer.adzuna.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-100"
            >
              free Adzuna API keys
            </a>{' '}
            to <code className="bg-amber-950 px-1 rounded">.env.local</code> to see real live listings.
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            search={search}
            roleFilter={roleFilter}
            sectorFilter={sectorFilter}
            timeFilter={timeFilter}
            sortBy={sortBy}
            showHidden={showHidden}
            onSearch={setSearch}
            onRole={setRoleFilter}
            onSector={setSectorFilter}
            onTime={setTimeFilter}
            onSort={setSortBy}
            onToggleHidden={() => setShowHidden(v => !v)}
          />
        </div>

        {/* Status line */}
        {!loading && !error && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              {filtered.length} of {jobs.length} roles
              {refreshedAt && ` · refreshed ${timeLabel(refreshedAt)}`}
            </p>
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-neutral-600">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">⚡</div>
              <p className="text-sm">Fetching your roles...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-neutral-500 text-sm">No roles match your filters.</p>
            <button
              onClick={() => {
                setSearch('')
                setRoleFilter('All')
                setSectorFilter('All')
                setTimeFilter('all')
              }}
              className="mt-3 text-xs text-violet-400 hover:text-violet-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                status={statuses[job.id] || 'new'}
                onSelect={() => setSelectedJob(job)}
                onStatus={s => setJobStatus(job.id, s)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          status={statuses[selectedJob.id] || 'new'}
          onClose={() => setSelectedJob(null)}
          onStatus={s => {
            setJobStatus(selectedJob.id, s)
            if (s === 'hidden') setSelectedJob(null)
          }}
        />
      )}
    </div>
  )
}
