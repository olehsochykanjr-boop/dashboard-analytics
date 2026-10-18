import Papa from 'papaparse'

export type ParsedTable = {
  columns: string[]
  rows: Record<string, string>[]
}

export function parseCsv(file: File): Promise<ParsedTable> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          columns: results.meta.fields ?? [],
          rows: results.data,
        })
      },
      error: (error) => reject(error),
    })
  })
}