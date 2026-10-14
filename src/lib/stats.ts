import type { ParsedTable } from './parseCsv'

export type Summary = {
  total: number
  average: number
  max: number
  count: number
}

export function summarize(table: ParsedTable, column: string): Summary {
  const values = table.rows
    .map((row) => Number((row[column] ?? '').replace(/\s/g, '').replace(',', '.')))
    .filter((value) => !Number.isNaN(value))

  const total = values.reduce((sum, value) => sum + value, 0)

  return {
    total,
    average: values.length > 0 ? total / values.length : 0,
    max: values.length > 0 ? Math.max(...values) : 0,
    count: values.length,
  }
}

export function sumByCategory(
  table: ParsedTable,
  categoryColumn: string,
  valueColumn: string,
): { label: string; value: number }[] {
  const totals = new Map<string, number>()

  for (const row of table.rows) {
    const category = (row[categoryColumn] ?? '').trim()
    const value = Number((row[valueColumn] ?? '').replace(/\s/g, '').replace(',', '.'))
    if (category === '' || Number.isNaN(value)) continue

    totals.set(category, (totals.get(category) ?? 0) + value)
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}