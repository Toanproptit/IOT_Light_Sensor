import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

const STATUS_LABELS = {
  normal: 'Bình thường',
  warning: 'Cần chú ý',
  low: 'Mức thấp',
  success: 'Thành công',
  failed: 'Thất bại',
}

export function DataTableHead({ columns }) {
  return (
    <div className='table-head'>
      {columns.map((column) => {
        const config = typeof column === 'string' ? { key: column, label: column } : column

        return (
          <span key={config.key}>
            {config.onSort ? (
              <button
                type='button'
                className='table-sort-button'
                onClick={config.onSort}
                aria-label={config.direction === 'asc' ? 'Sort newest first' : 'Sort oldest first'}
              >
                {config.label}
                {config.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              </button>
            ) : config.label}
          </span>
        )
      })}
    </div>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      <i />
      {STATUS_LABELS[status]}
    </span>
  )
}

export function EmptyState() {
  return (
    <div className="empty-state">
      <Search size={25} />
      <strong>Không tìm thấy dữ liệu</strong>
      <span>Hãy thử thay đổi bộ lọc.</span>
    </div>
  )
}

export function TableFooter({ count, page, maxPage, pageSize, onPage, onPageSize }) {
  const firstRow = count ? (page - 1) * pageSize + 1 : 0
  const lastRow = Math.min(page * pageSize, count)

  return (
    <div className="table-footer">
      <div className="table-footer-info">
        <span>Hiển thị {firstRow}–{lastRow} trong {count} kết quả</span>
        <label className="rows-per-page">
          <span>Số dòng/trang</span>
          <select
            aria-label="Chọn số dòng mỗi trang"
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="pagination">
        <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: maxPage }, (_, index) => (
          <button
            key={index}
            type="button"
            className={page === index + 1 ? 'active' : ''}
            onClick={() => onPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" disabled={page === maxPage} onClick={() => onPage(page + 1)}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
