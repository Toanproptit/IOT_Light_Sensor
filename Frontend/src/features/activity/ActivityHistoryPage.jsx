import { useMemo, useState } from 'react'
import { Lightbulb, Search } from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import {
  DataTableHead,
  EmptyState,
  StatusBadge,
  TableFooter,
} from '../../components/common/DataTable'
import { activityRows } from '../../mocks/iotData'
import { matchesTimeText } from '../../utils/dateTime'

const DEVICE_OPTIONS = [...new Set(activityRows.map((row) => row.device))]

const getActionClassName = (actionName) => {
  if (actionName === 'Mất kết nối') return 'action-chip disconnected'
  if (actionName.startsWith('Tắt')) return 'action-chip off'
  return 'action-chip'
}

export default function ActivityHistoryPage() {
  const [device, setDevice] = useState('all')
  const [action, setAction] = useState('all')
  const [status, setStatus] = useState('all')
  const [timeQuery, setTimeQuery] = useState('')
  const [appliedTimeQuery, setAppliedTimeQuery] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredRows = useMemo(() => activityRows.filter((row) => {
    const deviceMatch = device === 'all' || row.device === device
    const actionMatch = action === 'all' || row.action.toLowerCase().includes(action)
    const statusMatch = status === 'all' || row.status === status
    const timeMatch = matchesTimeText(row, appliedTimeQuery)
    return deviceMatch && actionMatch && statusMatch && timeMatch
  }), [device, action, status, appliedTimeQuery])

  const sortedRows = useMemo(() => [...filteredRows].sort((firstRow, secondRow) => {
    const comparison = Date.parse(firstRow.timestamp) - Date.parse(secondRow.timestamp)
    return sortDirection === 'asc' ? comparison : -comparison
  }), [filteredRows, sortDirection])

  const maxPage = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = sortedRows.slice((page - 1) * pageSize, page * pageSize)

  const updateFilter = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const toggleTimeSort = () => {
    setSortDirection((currentDirection) => (currentDirection === 'desc' ? 'asc' : 'desc'))
    setPage(1)
  }

  const handleTimeSearch = (event) => {
    event.preventDefault()
    setAppliedTimeQuery(timeQuery.trim())
    setPage(1)
  }

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  return (
    <div className="page">
      <PageIntro
        eyebrow="Nhật ký hệ thống"
        title="Lịch sử bật/tắt"
      />

      <section className="card table-card">
        <form className="filters history-filters" onSubmit={handleTimeSearch}>
          <div className="search-control with-hint">
            <label className="search-field">
              <Search size={17} />
              <input
                type="text"
                aria-label="Nhập thời gian cần tìm"
                aria-describedby="activity-time-hint"
                value={timeQuery}
                onChange={(event) => setTimeQuery(event.target.value)}
                placeholder="VD: 10:45 hoặc 18/08/2026 10:45"
              />
            </label>
            <small className="time-input-hint" id="activity-time-hint">
              Định dạng: HH:mm, HH:mm:ss AM/PM hoặc DD/MM/YYYY HH:mm
            </small>
          </div>
          <label className="select-field">
            <select aria-label="Lọc theo tên thiết bị" value={device} onChange={updateFilter(setDevice)}>
              <option value="all">Tất cả thiết bị</option>
              {DEVICE_OPTIONS.map((deviceName) => (
                <option value={deviceName} key={deviceName}>{deviceName}</option>
              ))}
            </select>
          </label>
          <label className="select-field">
            <select value={action} onChange={updateFilter(setAction)}>
              <option value="all">Tất cả hành động</option>
              <option value="bật">Bật thiết bị</option>
              <option value="tắt">Tắt thiết bị</option>
              <option value="mất kết nối">Mất kết nối</option>
            </select>
          </label>
          <label className="select-field">
            <select value={status} onChange={updateFilter(setStatus)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </label>
          <button type="submit" className="activity-search-button">
            <Search size={16} />
            Tìm
          </button>
        </form>

        <DataTableHead
          columns={[
            'Thiết bị',
            'Hành động',
            'Người thực hiện',
            'Trạng thái',
            {
              key: 'time',
              label: 'Thời gian',
              direction: sortDirection,
              onSort: toggleTimeSort,
            },
          ]}
        />
        <div className="table-body history-table">
          {visibleRows.length ? visibleRows.map((row) => (
            <div className="table-row" key={row.id}>
              <span className="sensor-name">
                <i className="sensor-dot device"><Lightbulb size={15} /></i>
                <span>{row.device}<small>{row.room}</small></span>
              </span>
              <span className={getActionClassName(row.action)}>{row.action}</span>
              <span>{row.user}</span>
              <StatusBadge status={row.status} />
              <span>{row.time}<small>{row.date}</small></span>
            </div>
          )) : <EmptyState />}
        </div>
        <TableFooter
          count={filteredRows.length}
          page={page}
          maxPage={maxPage}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={handlePageSizeChange}
        />
      </section>
    </div>
  )
}
