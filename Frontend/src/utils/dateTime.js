const normalizeTimeText = (value) => String(value).trim().toLocaleLowerCase('vi')

export function matchesTimeText(row, query) {
  const normalizedQuery = normalizeTimeText(query)
  if (!normalizedQuery) return true

  const isoTime = row.timestamp?.split('T')[1] ?? ''
  const searchableText = [
    row.time,
    row.date,
    row.timestamp,
    row.timestamp?.replace('T', ' '),
    `${row.date} ${row.time}`,
    `${row.date} ${isoTime}`,
  ].join(' ')

  return normalizeTimeText(searchableText).includes(normalizedQuery)
}

export function formatApiDateTime(value) {
  if (!value) return { timestamp: '', time: '--:--:--', date: '--/--/----' }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return { timestamp: value, time: value, date: '' }
  return {
    timestamp: parsed.toISOString(),
    time: new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(parsed),
    date: new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(parsed),
  }
}
