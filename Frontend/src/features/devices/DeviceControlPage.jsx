import {
  ChevronRight,
  History,
  Lightbulb,
  MapPin,
  MoreHorizontal,
  Power,
  Settings,
  Sparkles,
} from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import Toggle from '../../components/common/Toggle'

export default function DeviceControlPage({ devices, onToggle, onBrightness, onAllOff }) {
  return (
    <div className="page">
      <PageIntro
        eyebrow="Thiết bị thông minh"
        title="Điều khiển thiết bị"
        description="Bật, tắt và tùy chỉnh các đèn LED trong Phòng IoT 01."
        action={(
          <button className="secondary-button danger-ghost" onClick={onAllOff}>
            <Power size={16} /> Tắt tất cả
          </button>
        )}
      />

      <div className="control-bar card">
        <div className="room-summary">
          <span className="room-icon"><MapPin size={18} /></span>
          <div>
            <strong>Phòng IoT 01</strong>
            <span>{devices.length} đèn LED · 3 cảm biến</span>
          </div>
        </div>
        <div className="control-actions">
          <span className="connection-badge"><i /> Đã kết nối</span>
          <button className="icon-button" aria-label="Cài đặt thiết bị"><Settings size={18} /></button>
        </div>
      </div>

      <div className="device-grid">
        {devices.map((device) => (
          <article className={`device-card card ${device.on ? 'is-on' : ''}`} key={device.id}>
            <div className="device-card-head">
              <span className="large-device-icon"><Lightbulb size={24} /></span>
              <Toggle
                on={device.on}
                onChange={() => onToggle(device.id)}
                label={`${device.on ? 'Tắt' : 'Bật'} ${device.name}`}
              />
            </div>
            <div className="device-info">
              <span>{device.room}</span>
              <h3>{device.name}</h3>
              <p><i />{device.on ? `Đang bật · ${device.brightness}%` : 'Đã tắt'}</p>
            </div>
            <div className={`brightness ${device.on ? '' : 'disabled'}`}>
              <div><span>Độ sáng</span><strong>{device.brightness}%</strong></div>
              <input
                aria-label={`Độ sáng ${device.name}`}
                type="range"
                min="10"
                max="100"
                value={device.brightness}
                onChange={(event) => onBrightness(device.id, Number(event.target.value))}
                style={{ '--value': `${device.brightness}%` }}
              />
            </div>
            <div className="device-footer">
              <span><History size={14} /> {device.updated}</span>
              <button aria-label={`Tùy chọn ${device.name}`}><MoreHorizontal size={18} /></button>
            </div>
          </article>
        ))}
      </div>

      <div className="automation-banner">
        <span className="automation-icon"><Sparkles size={21} /></span>
        <div>
          <strong>Tự động hóa phòng IoT</strong>
          <p>Tạo lịch bật/tắt LED dựa trên thời gian và cảm biến ánh sáng.</p>
        </div>
        <button className="dark-button">Thiết lập ngay <ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
