'use client'

import { Job, JobStatus } from '@/lib/types'
import { whyItFits } from '@/lib/scorer'
import ScoreBar from './ScoreBar'
import { useEffect } from 'react'

interface Props {
  job: Job
  status: JobStatus
  onClose: () => void
  onStatus: (status: JobStatus) => void
}

const OUTREACH_TEMPLATES: Partial<Record<string, string>> = {
  'Solutions Engineer': 'solutions engineering — the intersection of technical depth and customer relationship-building',
  'Technical Program Manager': 'technical program management — driving complex cross-functional programs from ambiguity to execution',
  'Associate Product Manager': 'product management — translating customer problems and business goals into product decisions',
  'Customer Success Engineer': 'customer success — making sure customers get maximum value from complex technical products',
  'Technical Account Manager': 'technical account management — being the trusted technical partner for enterprise customers',
  'Forward Deployed Engineer': 'forward deployment — solving real customer problems at the intersection of engineering and consulting',
  'Implementation Manager': 'implementation — coordinating complex enterprise onboarding across technical and business stakeholders',
  'Product Operations': 'product operations — building the operational connective tissue that makes product orgs work',
  'Solutions Consultant': 'solutions consulting — designing solutions to complex business problems using technical products',
}

export default function JobModal({ job, status, onClose, onStatus }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const roleDesc = OUTREACH_TEMPLATES[job.role_type] || 'this type of role'

  const outreach = `Hi [Name],

I came across the ${job.title} role at ${job.company} and wanted to reach out directly.

I'm a CS grad with two years at Mastercard, where I focused on bridging technical and business teams. A few things I'm proud of: I helped reduce dashboard load times from ~15 minutes to under 15 seconds by coordinating investigations across data pipelines and engineering teams, and I led cross-functional platform initiatives involving engineering, product, QA, and leadership — clarifying ambiguous requirements and driving execution from idea to launch.

What draws me to ${job.company} is the work you're doing in ${job.sector}${job.sector === 'AI' ? ' — I think there\'s a massive opportunity for people who can translate AI capabilities into real business value' : ''}, and I'm genuinely excited about ${roleDesc}.

Would you have 15 minutes to connect? Happy to share more.

Best,
Emily Patchen
emilykpatchen@gmail.com`

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#111] border-b border-neutral-800 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">{job.title}</h2>
            <p className="text-neutral-400">{job.company} · {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 transition-colors shrink-0 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Scores */}
          <div className="bg-neutral-900 rounded-xl p-4 flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Fit Scores</p>
            <ScoreBar label="Technical Fit" value={job.scores.technical_fit} color="#3b82f6" />
            <ScoreBar label="Comm / Stakeholder" value={job.scores.comm_fit} color="#8b5cf6" />
            <ScoreBar label="Growth Potential" value={job.scores.growth} color="#f59e0b" />
          </div>

          {/* Why it fits */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Why This Fits You</p>
            <p className="text-sm text-neutral-300 leading-relaxed">{whyItFits(job.role_type, job.sector)}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Role Description</p>
            <p className="text-sm text-neutral-400 leading-relaxed">{job.description}</p>
          </div>

          {/* Networking tip */}
          <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Networking Tip</p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Search LinkedIn for <strong className="text-neutral-100">&ldquo;{job.company}&rdquo;</strong> and find:
              the hiring manager for this role, a{' '}
              {job.role_type.includes('Product') ? 'Senior PM or Head of Product' :
               job.role_type.includes('Solutions') ? 'Head of Solutions or VP of Sales' :
               job.role_type.includes('Customer') ? 'Head of Customer Success' :
               job.role_type.includes('Program') ? 'Senior TPM or Engineering Manager' :
               'relevant team lead'}
              , and someone who recently joined in a similar role. Reach out to all three.
            </p>
          </div>

          {/* Outreach message */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Outreach Template</p>
            <div className="relative">
              <pre className="text-xs text-neutral-400 bg-neutral-900 rounded-xl p-4 whitespace-pre-wrap leading-relaxed font-mono">
                {outreach}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(outreach)}
                className="absolute top-3 right-3 text-xs text-neutral-500 hover:text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
            >
              View & Apply →
            </a>
            <button
              onClick={() => { onStatus(status === 'saved' ? 'new' : 'saved'); }}
              className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                status === 'saved'
                  ? 'bg-yellow-900/40 border-yellow-700 text-yellow-400'
                  : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              {status === 'saved' ? '★ Saved' : '☆ Save'}
            </button>
            <button
              onClick={() => { onStatus(status === 'applied' ? 'new' : 'applied'); }}
              className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                status === 'applied'
                  ? 'bg-green-900/40 border-green-700 text-green-400'
                  : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              {status === 'applied' ? '✓ Applied' : 'Mark Applied'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
