'use client'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  nextStepName?: string
}

export function CircularProgress({
  percentage,
  size = 52,
  strokeWidth = 6,
  showLabel = true,
  nextStepName,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative progress-container" style={{ width: size, height: size }}>
      {/* Tooltip */}
      {nextStepName && (
        <div className="progress-tooltip">
          <span className="text-primary font-medium">Next:</span>{' '}
          <span className="text-foreground">{nextStepName}</span>
        </div>
      )}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
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
        {/* Progress Fill - Smooth with Soft Glow */}
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
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))',
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  )
}
