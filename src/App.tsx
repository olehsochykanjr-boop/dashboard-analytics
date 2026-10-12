import { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataTable from './components/DataTable'
import type { ParsedTable } from './lib/parseCsv'

function App() {
  const [table, setTable] = useState<ParsedTable | null>(null)

  return (
    <main>
      <h1>Dashboard Analytics</h1>
      <p>Завантаж CSV файл, щоб побачити аналітику.</p>
      <FileUpload onParsed={setTable} />
      {table && <DataTable table={table} />}
    </main>
  )
}

export default App