import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import type { ParsedTable } from './lib/parseCsv'

function App() {
  const [table, setTable] = useState<ParsedTable | null>(null)
  const [uploadId, setUploadId] = useState(0)

  const handleParsed = (parsed: ParsedTable) => {
    setTable(parsed)
    setUploadId((id) => id + 1)
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Dashboard Analytics</h1>
        <p>Завантаж CSV або Excel файл, щоб побачити аналітику.</p>
      </header>

      <section className="card">
        <FileUpload onParsed={handleParsed} />
      </section>

      {table && <Dashboard key={uploadId} table={table} />}
    </main>
  )
}

export default App