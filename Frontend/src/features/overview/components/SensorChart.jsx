import { useState } from 'react'
import { chartLabels, chartSeries } from '../../../mocks/iotData'

const METRIC_CONFIG = {
  temperature: { label: 'Nhiệt độ', unit: '°C', color: '#b9ef38', min: 23, max: 31 },
  humidity: { label: 'Độ ẩm', unit: '%', color: '#33aa78', min: 60, max: 80 },
  light: { label: 'Ánh sáng', unit: ' lux', color: '#dbff70', min: 200, max: 900 },
}

const METRIC_LABELS = {
  temperature: 'Nhiệt độ',
  humidity: 'Độ ẩm',
  light: 'Ánh sáng',
}

export default function SensorChart() {
  const [metric, setMetric] = useState('temperature')
  const config = METRIC_CONFIG[metric]
  const values = chartSeries[metric]
  const points = values.map((value, index) => {
    const x = 36 + (index * 584) / (values.length - 1)
    const y = 174 - ((value - config.min) / (config.max - config.min)) * 126
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `36,190 ${points} 620,190`

  return (
    <section className="card chart-card">
      <div className="section-head">
        <div><h2>Biểu đồ cảm biến</h2><p>Dữ liệu 7 ngày gần nhất</p></div>
        <div className="segmented">
          {Object.keys(METRIC_CONFIG).map((key) => (
            <button
              className={metric === key ? 'active' : ''}
              key={key}
              onClick={() => setMetric(key)}
            >
              {METRIC_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrap">
        <div className="chart-y-labels">
          <span>{config.max}{config.unit}</span>
          <span>{Math.round((config.max + config.min) / 2)}{config.unit}</span>
          <span>{config.min}{config.unit}</span>
        </div>
        <svg viewBox="0 0 656 210" preserveAspectRatio="none" role="img" aria-label={`Biểu đồ ${config.label}`}>
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={config.color} stopOpacity="0.28" />
              <stop offset="1" stopColor={config.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[48, 111, 174].map((y) => <line key={y} x1="36" x2="620" y1={y} y2={y} className="grid-line" />)}
          <polygon points={areaPoints} fill="url(#chartArea)" />
          <polyline points={points} fill="none" stroke={config.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {points.split(' ').map((point, index) => {
            const [cx, cy] = point.split(',')
            return (
              <circle
                key={point}
                cx={cx}
                cy={cy}
                r={index === values.length - 1 ? 5 : 3.2}
                fill={config.color}
                stroke="#fff"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        <div className="chart-labels">
          {chartLabels.map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
    </section>
  )
}
