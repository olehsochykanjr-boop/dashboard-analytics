import type { ParsedTable } from './parseCsv'
import { toIsoDate } from './aggregate'

export type RowFilters = {
  from: string
  to: string
  categoryColumn: string
  categoryValue: string
}

export const emptyFilters: RowFilters = {
  from: '',
  to: '',
  categoryColumn: '',
  categoryValue: '',
}

export function filterRows(
  table: ParsedTable,
  dateColumn: string | undefined,
  filters: RowFilters,
): ParsedTable {
  const rows = table.rows.filter((row) => {
    if (dateColumn && (filters.from || filters.to)) {
      const date = toIsoDate(row[dateColumn] ?? '')
      if (date === null) return false
      if (filters.from && date < filters.from) return false
      if (filters.to && date > filters.to) return false
    }

    if (filters.categoryColumn && filters.categoryValue) {
      const value = (row[filters.categoryColumn] ?? '').trim()
      if (value !== filters.categoryValue) return false
    }

    return true
  })

  return { columns: table.columns, rows }
}

export function uniqueValues(table: ParsedTable, column: string): string[] {
  const values = new Set<string>()
  for (const row of table.rows) {
    const value = (row[column] ?? '').trim()
    if (value !== '') values.add(value)
  }
  return [...values].sort((a, b) => a.localeCompare(b))
}