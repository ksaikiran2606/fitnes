import React from 'react'
import { Card } from 'react-bootstrap'

const SimpleChart = ({ title, data, color = '#007bff', height = 200 }) => {
  // Simple bar chart implementation
  const maxValue = Math.max(...data.map(item => item.value), 1)
  
  return (
    <Card className="enhanced-card h-100">
      <Card.Header className="bg-transparent border-0">
        <h6 className="mb-0">{title}</h6>
      </Card.Header>
      <Card.Body>
        <div style={{ height: `${height}px` }} className="d-flex align-items-end justify-content-between">
          {data.map((item, index) => (
            <div key={index} className="d-flex flex-column align-items-center" style={{ width: `${100 / data.length}%` }}>
              <div
                style={{
                  height: `${(item.value / maxValue) * 80}%`,
                  backgroundColor: color,
                  width: '60%',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px'
                }}
                className="mb-2"
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {item.label}
              </small>
              <small className="fw-bold" style={{ fontSize: '0.75rem' }}>
                {item.value}
              </small>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default SimpleChart