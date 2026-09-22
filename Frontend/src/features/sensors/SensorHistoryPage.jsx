import { useMemo, useState } from 'react'
import { Droplets, ExternalLink, Filter, Search, Sun, Thermometer } from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import {
  DataTableHead,
  EmptyState,
  StatusBadge,
  TableFooter,
} from '../../components/common/DataTable'
import { sensorRows } from '../../mocks/iotData'
import { matchesDateTime } from '../../utils/dateTime'

const SENSOR_ICONS = {
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
}

const PAGE_SIZE = 5

export default function SensorHistoryPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateTime, setDateTime] = useState('')
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(() => sensorRows.filter((row) => {
    const queryMatch = `${row.id} ${row.sensor}`.toLowerCase().includes(query.toLowerCase())
    const typeMatch = type === 'all' || row.type === type
    const statusMatch = status === 'all' || row.status === status
    const timeMatch = matchesDateTime(row.timestamp, dateTime)
    return queryMatch && typeMatch && statusMatch && timeMatch
  }), [query, type, status, dateTime])

  const maxPage = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateFilter = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  return (
    <div className="page">
      <PageIntro
        eyebrow="Dữ liệu cảm biến"
        title="Lịch sử cảm biến"
        description="Theo dõi dữ liệu nhiệt độ, độ ẩm và ánh sáng trong Phòng IoT 01."
        action={<button className="secondary-button"><ExternalLink size={16} /> Xuất dữ liệu</button>}
      />

      <div className="summary-strip">
        <div><span>Tổng bản ghi</span><strong>1,245</strong></div>
        <div><span>Cảm biến online</span><strong>03/03</strong></div>
        <div><span>Cập nhật cuối</span><strong>10:45:32 AM</strong></div>
      </div>

      <section className="card table-card">
        <div className="filters sensor-filters">
          <label className="search-field">
            <Search size={17} />
            <input value={query} onChange={updateFilter(setQuery)} placeholder="Tìm ID hoặc tên cảm biến..." />
          </label>
          <label className="select-field">
            <Filter size={16} />
            <select value={type} onChange={updateFilter(setType)}>
              <option value="all">Tất cả cảm biến</option>
              <option value="temperature">Nhiệt độ</option>
              <option value="humidity">Độ ẩm</option>
              <option value="light">Ánh sáng</option>
            </select>
          </label>
          <label className="select-field">
            <select value={status} onChange={updateFilter(setStatus)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="normal">Bình thường</option>
              <option value="warning">Cảnh báo</option>
              <option value="low">Mức thấp</option>
            </select>
          </label>
          <label className="date-field date-time-filter">
            <span>Thời gian</span>
            <input
              aria-label="Lọc theo thời gian"
              type="datetime-local"
              step="1"
              value={dateTime}
              onChange={updateFilter(setDateTime)}
            />
          </label>
        </div>

        <DataTableHead columns={['ID', 'Cảm biến', 'Giá trị', 'Đơn vị', 'Thời gian', 'Trạng thái']} />
        <div className="table-body sensor-table">
          {visibleRows.length ? visibleRows.map((row) => {
            const Icon = SENSOR_ICONS[row.type]
            return (
              <div className="table-row" key={row.id}>
                <span className="mono">#{row.id}</span>
                <span className="sensor-name">
                  <i className={`sensor-dot ${row.type}`}><Icon size={15} /></i>
                  <span>{row.sensor}</span>
                </span>
                <strong>{row.value}</strong>
                <span className="muted-text">{row.unit}</span>
                <span>{row.time} <small>{row.date}</small></span>
                <StatusBadge status={row.status} />
              </div>
            )
          }) : <EmptyState />}
        </div>
        <TableFooter count={filteredRows.length} page={page} maxPage={maxPage} onPage={setPage} />
      </section>
    </div>
  )
}
