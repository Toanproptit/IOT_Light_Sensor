import {
  Lightbulb,
  Power,
  Sun,
  Thermometer,
  Droplets,
} from 'lucide-react'
import Toggle from '../../components/common/Toggle'
import MetricCard from './components/MetricCard'
import SensorChart from './components/SensorChart'

export default function OverviewPage({ devices, onToggle, onAllOn, onAllOff }) {
  return (
    <div className="page overview-page">
      <div className="metrics-grid">
        <MetricCard label="Nhiệt độ" value="28.5" unit="°C" trend="1.2°C" icon={Thermometer} tone="lime" />
        <MetricCard label="Độ ẩm" value="72" unit="%" trend="3.1%" icon={Droplets} tone="green" />
        <MetricCard label="Ánh sáng" value="850" unit="lux" trend="6.8%" icon={Sun} tone="yellow" />
      </div>

      <div className="dashboard-grid">
        <SensorChart />
        <section className="card quick-devices">
          <div className="section-head">
            <div><h2>Thiết bị</h2><p>{devices.filter((device) => device.on).length}/{devices.length} đang hoạt động</p></div>
            <div className='quick-device-actions'>
              <button className='quick-device-action on' onClick={onAllOn}>
                <Power size={13} /> Bật tất cả
              </button>
              <button className='quick-device-action off' onClick={onAllOff}>
                <Power size={13} /> Tắt tất cả
              </button>
            </div>
          </div>
          <div className="quick-list">
            {devices.slice(0, 4).map((device) => (
              <div className="quick-device" key={device.id}>
                <span className={`device-icon ${device.on ? 'active' : ''}`}><Lightbulb size={18} /></span>
                <div><strong>{device.name}</strong><span>{device.room}</span></div>
                <Toggle on={device.on} onChange={() => onToggle(device.id)} label={`${device.on ? 'Tắt' : 'Bật'} ${device.name}`} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
