'use client'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
}

export function Sparkline({ data, width = 120, height = 32 }: SparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      className="sparkline-glow"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke="#00ff88"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End dot indicator */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill="#00ff88"
      />
    </svg>
  )
}
