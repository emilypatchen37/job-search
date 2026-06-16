'use client'

import { Job, JobStatus } from '@/lib/types'
import ScoreBar from './ScoreBar'

const SECTOR_COLORS: Record<string, string> = {
  'AI': 'bg-purple-950 text-purple-300 border border-purple-800',
  'Fintech': 'bg-blue-950 text-blue-300 border border-blue-800',
  'HealthTech': 'bg-emerald-950 text-emerald-300 border border-emerald-800',
  'B2B SaaS': 'bg-slate-800 text-slate-300 border border-slate-600',
  'EdTech': 'bg-orange-950 text-orange-300 border border-orange-800',
  'HRTech': 'bg-pink-950 text-pink-300 border border-pink-800',
  'Other': 'bg-neutral-800 text-neutral-300 border border-neutral-600',
}

interface Props {
  job: Job
  status: JobStatus
  onSelect: () => void
  onStatus: (status: JobStatus) => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Just posted'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return ''
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (max) return `up to ${fmt(max)}`
  return `from ${fmt(min!)}`
}

export default function JobCard({ job, status, onSelect, onStatus }: Props) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const sectorClass = SECTOR_COLORS[job.sector] || SECTOR_COLORS['Other']

  if (status === 'hidden') return null

  return (
    <div
      className={`
        group relative flex flex-col gap-3 p-5 rounded-xl border cursor-pointer
        transition-all duration-150
        ${status === 'applied'
          ? 'bg-[#111] border-green-800 opacity-75'
          : 'bg-[#111] border-neutral-800 hover:border-neutral-600 hover:bg-[#181818]'
        }
      `}
      onClick={onSelect}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {job.is_new && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-900 text-green-400 border border-green-700">
                New
              </span>
            )}
            {status === 'saved' && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-yellow-900 text-yellow-400 border border-yellow-700">
                Saved
              </span>
            )}
            {status === 'applied' && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-900 text-green-400 border border-green-700">
                Applied
              </span>
            )}
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sectorClass}`}>
              {job.sector}
            </span>
          </div>
          <h3 className="font-semibold text-neutral-100 text-sm leading-snug">{job.title}</h3>
          <p className="text-sm text-neutral-400 mt-0.5">{job.company}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span>📍 {job.location}</span>
        <span>·</span>
        <span>{timeAgo(job.posted_at)}</span>
        {salary && (
          <>
            <span>·</span>
            <span className="text-neutral-400">{salary}</span>
          </>
        )}
      </div>

      {/* Scores */}
      <div className="flex flex-col gap-1.5 pt-1">
        <ScoreBar label="Tech"  value={job.scores.technical_fit} color="#3b82f6" />
        <ScoreBar label="Comm"  value={job.scores.comm_fit}       color="#8b5cf6" />
        <ScoreBar label="Growth" value={job.scores.growth}        color="#f59e0b" />
      </div>

      {/* Actions */}
      <div
        className="flex gap-2 pt-1"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onStatus(status === 'saved' ? 'new' : 'saved')}
          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
            status === 'saved'
              ? 'bg-yellow-900/40 border-yellow-700 text-yellow-400'
              : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
          }`}
        >
          {status === 'saved' ? '★ Saved' : '☆ Save'}
        </button>
        <button
          onClick={() => onStatus(status === 'applied' ? 'new' : 'applied')}
          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
            status === 'applied'
              ? 'bg-green-900/40 border-green-700 text-green-400'
              : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
          }`}
        >
          {status === 'applied' ? '✓ Applied' : 'Applied'}
        </button>
        <button
          onClick={() => onStatus('hidden')}
          className="px-3 text-xs py-1.5 rounded-lg border border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-400 transition-colors"
          title="Hide this job"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
