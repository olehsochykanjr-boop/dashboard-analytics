import { useMemo, useState } from 'react'
import type { ParsedTable } from '../lib/parseCsv'
import { detectColumnTypes } from '../lib/detectColumnTypes'
import { sortRows, type SortState } from '../lib/sortRows'

type DataTableProps = {
  table: ParsedTable
  pageSize?: number
}

function DataTable({ table, pageSize = 10 }: DataTableProps) {
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  const columnInfo = useMemo(() => detectColumnTypes(table), [table])

  const sortedRows = useMemo(() => {
    if (!sort) return table.rows
    const info = columnInfo.find((column) => column.name === sort.column)
    if (!info) return table.rows
    return sortRows(table.rows, sort.column, info.type, sort.direction)
  }, [table, columnInfo, sort])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  // Якщо після фільтрації сторінок стало менше, не виходимо за межі.
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const visibleRows = sortedRows.slice(start, start + pageSize)

  const handleSort = (columnName: string) => {
    setSort((current) =>
      current?.column === columnName
        ? { column: columnName, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { column: columnName, direction: 'asc' },
    )
    setPage(1)
  }

  return (
    <section className="card">
      <p className="table-meta">
        Колонок: {table.columns.length}, рядків: {table.rows.length}
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columnInfo.map((column) => {
                const isSorted = sort?.column === column.name
                const arrow = isSorted ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''
                return (
                  <th
                    key={column.name}
                    className={column.type === 'number' ? 'num' : undefined}
                    aria-sort={
                      isSorted
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      type="button"
                      className="sort-button"
                      onClick={() => handleSort(column.name)}
                    >
                      {column.name}
                      {arrow}
                    </button>
                    <span className="col-type">{column.type}</span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={start + index}>
                {columnInfo.map((column) => (
                  <td
                    key={column.name}
                    className={column.type === 'number' ? 'num' : undefined}
                  >
                    {row[column.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="table-meta">
          Показано {start + 1}–{start + visibleRows.length} з {sortedRows.length}
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Назад
          </button>
          <span>
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Вперед
          </button>
        </div>
      </div>
    </section>
  )
}

export default DataTable