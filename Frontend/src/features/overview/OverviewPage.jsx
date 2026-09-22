import {
  ChevronRight,
  History,
  Lightbulb,
  Power,
  ShieldCheck,
  Sun,
  Thermometer,
  Zap,
  Droplets,
} from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import Toggle from '../../components/common/Toggle'
import { activityRows } from '../../mocks/iotData'
import MetricCard from './components/MetricCard'
import SensorChart from './components/SensorChart'

export default function OverviewPage({ devices, onToggle, onNavigate }) {
  return (
    <div className="page overview-page">
      <PageIntro
        eyebrow="Thứ Ba, 18 tháng 8"
        title="Chào buổi chiều, Trọng Toàn!"
        description="Các đèn LED và cảm biến trong Phòng IoT 01 đang hoạt động ổn định."
        action={(
          <button className="primary-button" onClick={() => onNavigate('devices')}>
            <Power size={17} /> Điều khiển thiết bị
          </button>
        )}
      />

      <div className="metrics-grid">
        <MetricCard label="Nhiệt độ" value="28.5" unit="°C" trend="1.2°C" icon={Thermometer} tone="lime" />
        <MetricCard label="Độ ẩm" value="72" unit="%" trend="3.1%" icon={Droplets} tone="green" />
        <MetricCard label="Ánh sáng" value="850" unit="lux" trend="6.8%" icon={Sun} tone="yellow" />
        <MetricCard label="Điện năng hôm nay" value="3.2" unit="kWh" trend="4.5%" icon={Zap} tone="dark" />
      </div>

      <div className="dashboard-grid">
        <SensorChart />
        <section className="card quick-devices">
          <div className="section-head">
            <div><h2>Thiết bị</h2><p>{devices.filter((device) => device.on).length}/{devices.length} đang hoạt động</p></div>
            <button className="text-button" onClick={() => onNavigate('devices')}>Xem tất cả <ChevronRight size={16} /></button>
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

        <section className="card activity-card">
          <div className="section-head">
            <div><h2>Hoạt động gần đây</h2><p>Cập nhật mới nhất từ hệ thống</p></div>
            <button className="text-button" onClick={() => onNavigate('history')}>Xem lịch sử <ChevronRight size={16} /></button>
          </div>
          <div className="activity-timeline">
            {activityRows.slice(0, 3).map((row, index) => (
              <div className="timeline-row" key={row.id}>
                <span className={`timeline-icon ${index === 2 ? 'muted' : ''}`}><Lightbulb size={15} /></span>
                <div><strong>{row.action}</strong><p>{row.device} · {row.room}</p></div>
                <span className="timeline-time">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card system-card">
          <div className="system-status">
            <span><ShieldCheck size={21} /></span>
            <div><h2>Hệ thống ổn định</h2><p>Tất cả dịch vụ đang trực tuyến</p></div>
          </div>
          <div className="status-line"><span>Gateway trung tâm</span><strong><i /> Đã kết nối</strong></div>
          <div className="status-line"><span>Lần đồng bộ cuối</span><strong>Vừa xong</strong></div>
        </section>
      </div>
    </div>
  )
}
