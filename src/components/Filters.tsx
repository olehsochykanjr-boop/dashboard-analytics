import type { ParsedTable } from '../lib/parseCsv'
import type { ColumnInfo } from '../lib/detectColumnTypes'
import { uniqueValues, emptyFilters, type RowFilters } from '../lib/filterRows'

type FiltersProps = {
  table: ParsedTable
  columns: ColumnInfo[]
  filters: RowFilters
  onChange: (filters: RowFilters) => void
}

function Filters({ table, columns, filters, onChange }: FiltersProps) {
  const hasDate = columns.some((column) => column.type === 'date')
  const categoryColumns = columns.filter((column) => column.type === 'category')

  return (
    <div className="card filters">
      {hasDate && (
        <>
          <label className="field">
            <span>Від</span>
            <input
              type="date"
              value={filters.from}
              onChange={(event) => onChange({ ...filters, from: event.target.value })}
            />
          </label>
          <label className="field">
            <span>До</span>
            <input
              type="date"
              value={filters.to}
              onChange={(event) => onChange({ ...filters, to: event.target.value })}
            />
          </label>
        </>
      )}

      {categoryColumns.length > 0 && (
        <>
          <label className="field">
            <span>Фільтр за</span>
            <select
              value={filters.categoryColumn}
              onChange={(event) =>
                onChange({
                  ...filters,
                  categoryColumn: event.target.value,
                  categoryValue: '',
                })
              }
            >
              <option value="">—</option>
              {categoryColumns.map((column) => (
                <option key={column.name} value={column.name}>
                  {column.name}
                </option>
              ))}
            </select>
          </label>

          {filters.categoryColumn && (
            <label className="field">
              <span>Значення</span>
              <select
                value={filters.categoryValue}
                onChange={(event) =>
                  onChange({ ...filters, categoryValue: event.target.value })
                }
              >
                <option value="">Усі</option>
                {uniqueValues(table, filters.categoryColumn).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}
        </>
      )}

      <button type="button" onClick={() => onChange(emptyFilters)}>
        Скинути
      </button>
    </div>
  )
}

export default Filters