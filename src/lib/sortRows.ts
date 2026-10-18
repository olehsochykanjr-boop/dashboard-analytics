import type { ParsedTable } from './parseCsv'
import type { ColumnType } from './detectColumnTypes'
import { toIsoDate } from './aggregate'

export type SortDirection = 'asc' | 'desc'

export type SortState = {
  column: string
  direction: SortDirection
}

// Перетворюємо значення комірки на те, що можна порівнювати.
// null означає «порожньо або не вдалося розпізнати».
function sortKey(value: string, type: ColumnType): number | string | null {
  const trimmed = value.trim()
  if (trimmed === '') return null

  if (type === 'number') {
    const parsed = Number(trimmed.replace(/\s/g, '').replace(',', '.'))
    return Number.isNaN(parsed) ? null : parsed
  }

  if (type === 'date') {
    return toIsoDate(trimmed)
  }

  return trimmed.toLowerCase()
}

export function sortRows(
  rows: ParsedTable['rows'],
  column: string,
  type: ColumnType,
  direction: SortDirection,
): ParsedTable['rows'] {
  const factor = direction === 'asc' ? 1 : -1

  return [...rows].sort((rowA, rowB) => {
    const a = sortKey(rowA[column] ?? '', type)
    const b = sortKey(rowB[column] ?? '', type)

    // Порожні значення завжди в кінці, незалежно від напрямку.
    if (a === null || b === null) {
      if (a === b) return 0
      return a === null ? 1 : -1
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * factor
    }

    return String(a).localeCompare(String(b), 'uk') * factor
  })
}