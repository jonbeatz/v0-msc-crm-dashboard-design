'use client'

interface GlobalStatusGaugeProps {
  percentage: number
  label: string
}

export function GlobalStatusGauge({ percentage, label }: GlobalStatusGaugeProps) {
  const size = 80
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track - Thicker & Rounded */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Fill - Smooth & Glowing */}
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
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.4))',
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-primary">{percentage}%</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground">On Schedule</span>
      </div>
    </div>
  )
}
