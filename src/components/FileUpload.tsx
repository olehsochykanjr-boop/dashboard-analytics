import { useState, type ChangeEvent } from 'react'
import { parseCsv, type ParsedTable } from '../lib/parseCsv'

type FileUploadProps = {
  onParsed: (table: ParsedTable) => void
}

function FileUpload({ onParsed }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Поки що підтримуються тільки CSV файли.')
      return
    }

    try {
      const table = await parseCsv(file)
      onParsed(table)
    } catch {
      setError('Не вдалося прочитати файл.')
    }
  }

  return (
    <div>
      <label htmlFor="file-input">Оберіть CSV файл</label>
      <input
        id="file-input"
        type="file"
        accept=".csv"
        onChange={handleChange}
      />
      {fileName && <p>Вибрано: {fileName}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default FileUpload