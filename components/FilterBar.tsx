'use client'

import { RoleType, Sector } from '@/lib/types'

const ROLE_OPTIONS: Array<RoleType | 'All'> = [
  'All',
  'Technical Program Manager',
  'Solutions Engineer',
  'Associate Product Manager',
  'Customer Success Engineer',
  'Technical Account Manager',
  'Forward Deployed Engineer',
  'Implementation Manager',
  'Product Operations',
  'Solutions Consultant',
]

const SECTOR_OPTIONS: Array<Sector | 'All'> = [
  'All', 'AI', 'Fintech', 'HealthTech', 'B2B SaaS', 'HRTech', 'EdTech',
]

interface Props {
  search: string
  roleFilter: RoleType | 'All'
  sectorFilter: Sector | 'All'
  timeFilter: 'today' | 'week' | 'all'
  sortBy: 'newest' | 'score' | 'salary'
  showHidden: boolean
  onSearch: (v: string) => void
  onRole: (v: RoleType | 'All') => void
  onSector: (v: Sector | 'All') => void
  onTime: (v: 'today' | 'week' | 'all') => void
  onSort: (v: 'newest' | 'score' | 'salary') => void
  onToggleHidden: () => void
}

export default function FilterBar({
  search, roleFilter, sectorFilter, timeFilter, sortBy, showHidden,
  onSearch, onRole, onSector, onTime, onSort, onToggleHidden,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search + sort row */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search roles, companies..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
        />
        <select
          value={sortBy}
          onChange={e => onSort(e.target.value as 'newest' | 'score' | 'salary')}
          className="bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600"
        >
          <option value="newest">Newest</option>
          <option value="score">Best fit</option>
          <option value="salary">Salary</option>
        </select>
      </div>

      {/* Time filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'week', 'today'] as const).map(t => (
          <button
            key={t}
            onClick={() => onTime(t)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              timeFilter === t
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
            }`}
          >
            {t === 'all' ? 'All time' : t === 'week' ? 'This week' : 'Today only'}
          </button>
        ))}
        <div className="h-5 w-px bg-neutral-800 self-center mx-1" />
        {/* Sector pills */}
        {SECTOR_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => onSector(s as Sector | 'All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              sectorFilter === s
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Role filter pills */}
      <div className="flex gap-2 flex-wrap">
        {ROLE_OPTIONS.map(r => (
          <button
            key={r}
            onClick={() => onRole(r as RoleType | 'All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              roleFilter === r
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
            }`}
          >
            {r === 'All' ? 'All roles' : r}
          </button>
        ))}
        <div className="h-5 w-px bg-neutral-800 self-center mx-1" />
        <button
          onClick={onToggleHidden}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showHidden
              ? 'bg-neutral-700 border-neutral-600 text-neutral-200'
              : 'border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-400'
          }`}
        >
          {showHidden ? 'Hiding hidden' : 'Show hidden'}
        </button>
      </div>
    </div>
  )
}
