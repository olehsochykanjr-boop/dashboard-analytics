import { useState, type ChangeEvent } from 'react'
import { type ParsedTable } from '../lib/parseCsv'
import { parseFile, SUPPORTED_EXTENSIONS } from '../lib/parseFile'

type FileUploadProps = {
  onParsed: (table: ParsedTable) => void
}

function FileUpload({ onParsed }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)

    const isSupported = SUPPORTED_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    )
    if (!isSupported) {
      setError('Підтримуються файли CSV та Excel (.xlsx, .xls).')
      return
    }

    setLoading(true)
    try {
      const table = await parseFile(file)
      if (table.rows.length === 0) {
        setError('У файлі немає рядків з даними.')
        return
      }
      onParsed(table)
    } catch {
      setError('Не вдалося прочитати файл.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload">
      <label htmlFor="file-input" className="upload-area">
        <span className="upload-title">Оберіть CSV або Excel файл</span>
        <span className="upload-hint">.csv, .xlsx, .xls</span>
        <span className="upload-button">Обрати файл</span>
      </label>
      <input
        id="file-input"
        className="visually-hidden"
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(',')}
        onChange={handleChange}
      />

      {fileName && <p className="upload-status">Вибрано: {fileName}</p>}
      {loading && <p className="upload-status">Обробляю файл...</p>}
      {error && <p className="upload-error">{error}</p>}
    </div>
  )
}

export default FileUpload