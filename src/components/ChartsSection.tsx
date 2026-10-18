import { useState } from 'react'
import type { ParsedTable } from '../lib/parseCsv'
import { detectColumnTypes } from '../lib/detectColumnTypes'
import { sumByDate } from '../lib/aggregate'
import { summarize, sumByCategory } from '../lib/stats'
import TimeSeriesChart from './TimeSeriesChart'
import CategoryChart from './CategoryChart'
import StatCards from './StatCards'

type ChartsSectionProps = {
  table: ParsedTable
}

function ChartsSection({ table }: ChartsSectionProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const columns = detectColumnTypes(table)
  const dateColumn = columns.find((column) => column.type === 'date')
  const numberColumns = columns.filter((column) => column.type === 'number')
  const categoryColumns = columns.filter((column) => column.type === 'category')

  const valueColumn =
    numberColumns.find((column) => column.name === selectedValue) ??
    numberColumns[0]
  const categoryColumn =
    categoryColumns.find((column) => column.name === selectedCategory) ??
    categoryColumns[0]

  if (!valueColumn) {
    return <p>Не знайдено числових колонок, графіки не побудовано.</p>
  }

  return (
    <div>
      <div className="toolbar">
        <label htmlFor="value-column">Показник</label>
        <select
          id="value-column"
          value={valueColumn.name}
          onChange={(event) => setSelectedValue(event.target.value)}
        >
          {numberColumns.map((column) => (
            <option key={column.name} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
      </div>

      <StatCards
        summary={summarize(table, valueColumn.name)}
        label={valueColumn.name}
      />

      {dateColumn && (
        <TimeSeriesChart
          title={`${valueColumn.name} по днях`}
          data={sumByDate(table, dateColumn.name, valueColumn.name)}
        />
      )}

      {categoryColumn && (
        <CategoryChart
          title={`${valueColumn.name} за ${categoryColumn.name}`}
          data={sumByCategory(table, categoryColumn.name, valueColumn.name)}
          controls={
            <div className="toolbar">
              <label htmlFor="category-column">Групувати за</label>
              <select
                id="category-column"
                value={categoryColumn.name}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categoryColumns.map((column) => (
                  <option key={column.name} value={column.name}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      )}
    </div>
  )
}

export default ChartsSection