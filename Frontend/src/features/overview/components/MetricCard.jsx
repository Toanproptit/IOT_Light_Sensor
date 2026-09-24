export default function MetricCard({ label, value, unit, trend, icon: Icon, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-head">
        <span>{label}</span>
        <span className="metric-icon"><Icon size={18} /></span>
      </div>
      <div className="metric-value">{value}<small>{unit}</small></div>
    </article>
  )
}
