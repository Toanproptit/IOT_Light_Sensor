export function matchesDateTime(timestamp, dateTime) {
  if (!dateTime) return true

  return Math.floor(Date.parse(timestamp) / 1000) === Math.floor(Date.parse(dateTime) / 1000)
}
