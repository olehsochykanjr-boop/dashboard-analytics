import type { ParsedTable } from './parseCsv'
import { toIsoDate } from './aggregate'

export type ColumnType = 'date' | 'number' | 'category' | 'text'

export type ColumnInfo = {
  name: string
  type: ColumnType
}

const SAMPLE_SIZE = 100
const MATCH_RATIO = 0.9
const MAX_CATEGORIES = 20

function isNumber(value: string): boolean {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  return normalized !== '' && !Number.isNaN(Number(normalized))
}

function isDate(value: string): boolean {
  const iso = toIsoDate(value)
  if (iso === null) return false

  // Перевіряємо, що така дата справді існує (31.02 або 99.99 не пройдуть).
  const parsed = new Date(`${iso}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso
}

function detectType(values: string[]): ColumnType {
  const filled = values.map((v) => v.trim()).filter((v) => v !== '')
  if (filled.length === 0) return 'text'

  const share = (check: (v: string) => boolean) =>
    filled.filter(check).length / filled.length

  if (share(isNumber) >= MATCH_RATIO) return 'number'
  if (share(isDate) >= MATCH_RATIO) return 'date'

  const unique = new Set(filled).size
  return unique <= MAX_CATEGORIES ? 'category' : 'text'
}

export function detectColumnTypes(table: ParsedTable): ColumnInfo[] {
  const sample = table.rows.slice(0, SAMPLE_SIZE)

  return table.columns.map((name) => ({
    name,
    type: detectType(sample.map((row) => row[name] ?? '')),
  }))
}