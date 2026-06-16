'use client'

interface Props {
  label: string
  value: number
  color: string
}

export default function ScoreBar({ label, value, color }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 w-10 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-neutral-800">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${(value / 10) * 100}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums" style={{ color }}>{value}/10</span>
    </div>
  )
}
