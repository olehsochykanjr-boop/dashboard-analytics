import type { ParsedTable } from './parseCsv'

// Excel часто зберігає дату як дату з часом: "2026-10-01 0:00:00".
// Якщо час це північ, лишаємо тільки дату. Справжній час (14:30) не чіпаємо.
function stripMidnight(value: string): string {
  return value.replace(
    /^(\d{1,4}[-./]\d{1,2}[-./]\d{1,4}) 0{1,2}:00(?::00)?$/,
    '$1',
  )
}

export async function parseExcel(file: File): Promise<ParsedTable> {
  const XLSX = await import('xlsx')

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) throw new Error('Excel file has no sheets')

  const options = { header: 1, defval: '', dateNF: 'yyyy-mm-dd' } as const
  const formatted = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    ...options,
    raw: false,
  })
  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    ...options,
    raw: true,
  })

  const [headerRow, ...dataRows] = formatted
  if (!headerRow || headerRow.length === 0) {
    throw new Error('Excel sheet is empty')
  }

  const columns = headerRow.map(
    (cell, index) => String(cell).trim() || `Column ${index + 1}`,
  )

  const rows = dataRows
    .map((formattedRow, rowIndex) => {
      const rawRow = raw[rowIndex + 1] ?? []
      const record: Record<string, string> = {}

      columns.forEach((column, index) => {
        const rawCell = rawRow[index]
        record[column] =
          typeof rawCell === 'number'
            ? String(rawCell)
            : stripMidnight(String(formattedRow[index] ?? ''))
      })

      return record
    })
    .filter((row) => Object.values(row).some((value) => value.trim() !== ''))

  return { columns, rows }
}