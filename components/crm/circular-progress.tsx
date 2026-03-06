'use client'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

export function CircularProgress({
  percentage,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background Track */}
        <circle
          className="progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        {/* Progress Fill */}
        <circle
          className="progress-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-primary">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  )
}
