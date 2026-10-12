import { useState } from 'react'
import type { ParsedTable } from '../lib/parseCsv'
import { detectColumnTypes } from '../lib/detectColumnTypes'
import { sumByDate } from '../lib/aggregate'
import TimeSeriesChart from './TimeSeriesChart'

type ChartsSectionProps = {
  table: ParsedTable
}

function ChartsSection({ table }: ChartsSectionProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const columns = detectColumnTypes(table)
  const dateColumn = columns.find((column) => column.type === 'date')
  const numberColumns = columns.filter((column) => column.type === 'number')
  const valueColumn =
    numberColumns.find((column) => column.name === selected) ?? numberColumns[0]

  if (!dateColumn || !valueColumn) {
    return <p>Не знайдено колонку з датою та числом, графік не побудовано.</p>
  }

  const data = sumByDate(table, dateColumn.name, valueColumn.name)

  return (
    <div>
      <label htmlFor="value-column">Показник: </label>
      <select
        id="value-column"
        value={valueColumn.name}
        onChange={(event) => setSelected(event.target.value)}
      >
        {numberColumns.map((column) => (
          <option key={column.name} value={column.name}>
            {column.name}
          </option>
        ))}
      </select>

      <TimeSeriesChart
        title={`${valueColumn.name} по днях`}
        data={data}
      />
    </div>
  )
}

export default ChartsSection