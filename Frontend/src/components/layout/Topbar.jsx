import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  Droplets,
  Lightbulb,
  Menu,
  Settings,
} from 'lucide-react'
import { PAGE_TITLES } from '../../config/navigation'

export default function Topbar({ page, onMenu }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="mobile-menu" onClick={onMenu} aria-label="Mở menu"><Menu size={22} /></button>
        <span>{PAGE_TITLES[page]}</span>
      </div>

      <div className="top-actions">
        <button
          className="icon-button notification-button"
          aria-label="Thông báo"
          onClick={() => setNotificationsOpen((open) => !open)}
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <button className="icon-button" aria-label="Cài đặt"><Settings size={19} /></button>
        <div className="top-divider" />
        <button className="user-menu">
          <div className="avatar avatar-small">TT</div>
          <div><strong>Trọng Toàn</strong><span>Sinh viên PTIT</span></div>
          <ChevronDown size={15} />
        </button>
      </div>

      {notificationsOpen && (
        <div className="notification-popover card">
          <div className="popover-head"><strong>Thông báo</strong><span>2 mới</span></div>
          <div className="notice">
            <span className="notice-icon warn"><Droplets size={16} /></span>
            <div><strong>Độ ẩm đang cao</strong><p>Cảm biến khu vườn ghi nhận 81%.</p><small>2 phút trước</small></div>
          </div>
          <div className="notice">
            <span className="notice-icon"><Lightbulb size={16} /></span>
            <div><strong>LED 03 đã bật</strong><p>Thiết bị hoạt động theo lịch.</p><small>30 phút trước</small></div>
          </div>
        </div>
      )}
    </header>
  )
}
