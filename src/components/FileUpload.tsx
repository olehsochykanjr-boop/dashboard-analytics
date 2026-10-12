import { useState, type ChangeEvent } from 'react'

function FileUpload() {
    const [fileName, setFileName] = useState<string | null>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    console.log('Selected file:', file.name, file.size)
    }

    return (
    <div>
        <label htmlFor="file-input">Оберіть CSV або Excel файл</label>
        <input
        id="file-input"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        />
        {fileName && <p>Вибрано: {fileName}</p>}
    </div>
    )
}

export default FileUpload