import { parseCsv, type ParsedTable } from './parseCsv'
import { parseExcel } from './parseExcel'

export const SUPPORTED_EXTENSIONS = ['.csv', '.xlsx', '.xls']

export function parseFile(file: File): Promise<ParsedTable> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.csv')) return parseCsv(file)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return parseExcel(file)

  return Promise.reject(new Error('Unsupported file type'))
}