import { useMemo, useState } from 'react'
import { Droplets, Search, Sun, Thermometer } from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import {
  DataTableHead,
  EmptyState,
  StatusBadge,
  TableFooter,
} from '../../components/common/DataTable'
import { sensorRows } from '../../mocks/iotData'
import { matchesTimeText } from '../../utils/dateTime'

const SENSOR_ICONS = {
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
}

export default function SensorHistoryPage() {
  const [searchField, setSearchField] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState(null)
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredRows = useMemo(() => {
    if (!appliedSearch) return sensorRows

    if (appliedSearch.field === 'time') {
      return sensorRows.filter((row) => (
        matchesTimeText(row, appliedSearch.value)
      ))
    }

    if (appliedSearch.field === 'all') {
      const query = appliedSearch.value.toLocaleLowerCase('vi')
      return sensorRows.filter((row) => (
        [row.id, row.sensor, row.value, row.unit, row.time, row.date, row.status]
          .some((value) => String(value).toLocaleLowerCase('vi').includes(query))
      ))
    }

    return sensorRows.filter((row) => (
      row.type === appliedSearch.field
      && String(row.value).includes(appliedSearch.value)
    ))
  }, [appliedSearch])

  const sortedRows = useMemo(() => [...filteredRows].sort((firstRow, secondRow) => {
    const comparison = Date.parse(firstRow.timestamp) - Date.parse(secondRow.timestamp)
    return sortDirection === 'asc' ? comparison : -comparison
  }), [filteredRows, sortDirection])

  const maxPage = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = sortedRows.slice((page - 1) * pageSize, page * pageSize)

  const handleFieldChange = (event) => {
    setSearchField(event.target.value)
    setSearchInput('')
    setAppliedSearch(null)
    setPage(1)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const value = searchInput.trim()

    setAppliedSearch(value ? { field: searchField, value } : null)
    setPage(1)
  }

  const toggleTimeSort = () => {
    setSortDirection((currentDirection) => (currentDirection === 'desc' ? 'asc' : 'desc'))
    setPage(1)
  }

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  return (
    <div className="page">
      <PageIntro
        eyebrow="Dữ liệu cảm biến"
        title="Lịch sử cảm biến"
        description="Theo dõi dữ liệu nhiệt độ, độ ẩm và ánh sáng trong Phòng IoT 01."
      />

      <section className="card table-card">
        <form className='filters sensor-search-bar' onSubmit={handleSearch}>
          <label className='select-field'>
            <select
              aria-label='Chọn trường tìm kiếm'
              value={searchField}
              onChange={handleFieldChange}
            >
              <option value='all'>Tất cả</option>
              <option value='temperature'>Nhiệt độ</option>
              <option value='light'>Ánh sáng</option>
              <option value='humidity'>Độ ẩm</option>
              <option value='time'>Thời gian</option>
            </select>
          </label>
          <div className={`search-control ${searchField === 'time' ? 'with-hint' : ''}`}>
            <div className='search-field'>
              <Search size={17} />
              {searchField === 'time' ? (
                <input
                  type='text'
                  aria-label='Nhập thời gian cần tìm'
                  aria-describedby='sensor-time-hint'
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder='VD: 10:45 hoặc 18/08/2026 10:45'
                />
              ) : (
                <input
                  type={searchField === 'all' ? 'text' : 'number'}
                  step='any'
                  aria-label={searchField === 'all' ? 'Nhập nội dung cần tìm' : 'Nhập giá trị cảm biến'}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder='Nhập giá trị cần tìm...'
                />
              )}
            </div>
            {searchField === 'time' && (
              <small className='time-input-hint' id='sensor-time-hint'>
                Định dạng: HH:mm, HH:mm:ss AM/PM hoặc DD/MM/YYYY HH:mm
              </small>
            )}
          </div>
          <button type='submit' className='sensor-search-button'>
            <Search size={16} />
            Tìm
          </button>
        </form>

        <DataTableHead
          columns={[
            'ID',
            'Cảm biến',
            'Giá trị',
            'Đơn vị',
            {
              key: 'time',
              label: 'Thời gian',
              direction: sortDirection,
              onSort: toggleTimeSort,
            },
            'Trạng thái',
          ]}
        />
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
