'use client'

interface GlobalStatusGaugeProps {
  percentage: number
  label: string
}

export function GlobalStatusGauge({ percentage, label }: GlobalStatusGaugeProps) {
  const size = 72
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2d2d2d"
            strokeWidth={strokeWidth}
          />
          {/* Progress Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#00ff88"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.5))',
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-bold text-primary">{percentage}%</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs text-foreground">On Schedule</span>
      </div>
    </div>
  )
}
