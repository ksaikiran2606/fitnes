import React from 'react'

const ProgressCircle = ({ percentage, size = 80, strokeWidth = 8, color = '#007bff' }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="position-relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-90">
        {/* Background circle */}
        <circle
          stroke="#e9ecef"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div 
        className="position-absolute top-50 start-50 translate-middle text-center"
        style={{ width: '100%' }}
      >
        <span className="fw-bold" style={{ fontSize: size * 0.2 }}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export default ProgressCircle