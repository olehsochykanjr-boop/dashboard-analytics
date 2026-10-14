import type { ParsedTable } from './parseCsv'

export type SeriesPoint = {
  label: string
  value: number
}

export function toIsoDate(value: string): string | null {
  const trimmed = value.trim()

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10)

  const match = trimmed.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return null
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value.replace(/\s/g, '').replace(',', '.'))
  return Number.isNaN(parsed) ? null : parsed
}

export function sumByDate(
  table: ParsedTable,
  dateColumn: string,
  valueColumn: string,
): SeriesPoint[] {
  const totals = new Map<string, number>()

  for (const row of table.rows) {
    const date = toIsoDate(row[dateColumn] ?? '')
    const amount = toNumber(row[valueColumn] ?? '')
    if (date === null || amount === null) continue

    totals.set(date, (totals.get(date) ?? 0) + amount)
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }))
}