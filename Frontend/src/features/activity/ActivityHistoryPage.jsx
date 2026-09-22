import { useMemo, useState } from 'react'
import { ExternalLink, Lightbulb, Search } from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import {
  DataTableHead,
  EmptyState,
  StatusBadge,
  TableFooter,
} from '../../components/common/DataTable'
import { activityRows } from '../../mocks/iotData'
import { matchesDateTime } from '../../utils/dateTime'

const DEVICE_OPTIONS = [...new Set(activityRows.map((row) => row.device))]

export default function ActivityHistoryPage() {
  const [query, setQuery] = useState('')
  const [device, setDevice] = useState('all')
  const [action, setAction] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateTime, setDateTime] = useState('')

  const filteredRows = useMemo(() => activityRows.filter((row) => {
    const textMatch = `${row.id} ${row.device} ${row.room}`.toLowerCase().includes(query.toLowerCase())
    const deviceMatch = device === 'all' || row.device === device
    const actionMatch = action === 'all' || row.action.toLowerCase().includes(action)
    const statusMatch = status === 'all' || row.status === status
    const timeMatch = matchesDateTime(row.timestamp, dateTime)
    return textMatch && deviceMatch && actionMatch && statusMatch && timeMatch
  }), [query, device, action, status, dateTime])

  return (
    <div className="page">
      <PageIntro
        eyebrow="Nhật ký hệ thống"
        title="Lịch sử bật/tắt"
        description="Kiểm tra mọi thao tác điều khiển thiết bị trong hệ thống."
        action={<button className="secondary-button"><ExternalLink size={16} /> Tải báo cáo</button>}
      />

      <section className="card table-card">
        <div className="filters history-filters">
          <label className="search-field">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã, tên hoặc phòng..." />
          </label>
          <label className="select-field">
            <select aria-label="Lọc theo tên thiết bị" value={device} onChange={(event) => setDevice(event.target.value)}>
              <option value="all">Tất cả thiết bị</option>
              {DEVICE_OPTIONS.map((deviceName) => (
                <option value={deviceName} key={deviceName}>{deviceName}</option>
              ))}
            </select>
          </label>
          <label className="select-field">
            <select value={action} onChange={(event) => setAction(event.target.value)}>
              <option value="all">Tất cả hành động</option>
              <option value="bật">Bật thiết bị</option>
              <option value="tắt">Tắt thiết bị</option>
              <option value="độ sáng">Đổi độ sáng</option>
            </select>
          </label>
          <label className="select-field">
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </label>
          <label className="date-field date-time-filter">
            <span>Thời gian</span>
            <input
              aria-label="Lọc theo thời gian"
              type="datetime-local"
              step="1"
              value={dateTime}
              onChange={(event) => setDateTime(event.target.value)}
            />
          </label>
        </div>

        <DataTableHead columns={['Thiết bị', 'Hành động', 'Người thực hiện', 'Trạng thái', 'Thời gian']} />
        <div className="table-body history-table">
          {filteredRows.length ? filteredRows.map((row) => (
            <div className="table-row" key={row.id}>
              <span className="sensor-name">
                <i className="sensor-dot device"><Lightbulb size={15} /></i>
                <span>{row.device}<small>{row.room}</small></span>
              </span>
              <span className={`action-chip ${row.action.includes('Tắt') ? 'off' : ''}`}>{row.action}</span>
              <span>{row.user}</span>
              <StatusBadge status={row.status} />
              <span>{row.time}<small>{row.date}</small></span>
            </div>
          )) : <EmptyState />}
        </div>
        <TableFooter count={filteredRows.length} page={1} maxPage={1} onPage={() => {}} />
      </section>
    </div>
  )
}
