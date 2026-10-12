import type { ParsedTable } from '../lib/parseCsv'
import { detectColumnTypes } from '../lib/detectColumnTypes'

type DataTableProps = {
  table: ParsedTable
  limit?: number
}

function DataTable({ table, limit = 5 }: DataTableProps) {
  const visibleRows = table.rows.slice(0, limit)
  const columnInfo = detectColumnTypes(table)

  return (
    <div>
      <p>
        Колонок: {table.columns.length}, рядків: {table.rows.length}
      </p>
      <table>
        <thead>
          <tr>
            {columnInfo.map((column) => (
              <th key={column.name}>
                {column.name}
                <br />
                <small>{column.type}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={index}>
              {table.columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable