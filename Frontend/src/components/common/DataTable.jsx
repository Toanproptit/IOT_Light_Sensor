import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

const STATUS_LABELS = {
  normal: 'Bình thường',
  warning: 'Cần chú ý',
  low: 'Mức thấp',
  success: 'Thành công',
  failed: 'Thất bại',
}

export function DataTableHead({ columns }) {
  return (
    <div className="table-head">
      {columns.map((column) => <span key={column}>{column}</span>)}
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

export function TableFooter({ count, page, maxPage, onPage }) {
  return (
    <div className="table-footer">
      <span>
        Hiển thị {count ? (page - 1) * 5 + 1 : 0}–{Math.min(page * 5, count)} trong {count} kết quả
      </span>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: maxPage }, (_, index) => (
          <button
            key={index}
            className={page === index + 1 ? 'active' : ''}
            onClick={() => onPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button disabled={page === maxPage} onClick={() => onPage(page + 1)}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
