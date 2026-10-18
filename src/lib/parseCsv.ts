import Papa from 'papaparse'

export type ParsedTable = {
  columns: string[]
  rows: Record<string, string>[]
}

// Спочатку пробуємо UTF-8 (fatal: true кидає помилку на «битих» байтах),
// якщо не вийшло, читаємо як windows-1251 (типово для Excel в Україні).
async function readText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    return new TextDecoder('windows-1251').decode(buffer)
  }
}

export async function parseCsv(file: File): Promise<ParsedTable> {
  const text = await readText(file)
  const results = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })

  return {
    columns: results.meta.fields ?? [],
    rows: results.data,
  }
}