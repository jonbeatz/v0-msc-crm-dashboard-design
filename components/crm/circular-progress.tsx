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
            filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.5))',
            transition: 'stroke-dashoffset 0.5s ease',
          }}
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
