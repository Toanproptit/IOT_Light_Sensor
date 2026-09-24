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
