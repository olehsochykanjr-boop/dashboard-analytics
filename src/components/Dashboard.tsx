import { useMemo, useState } from 'react'
import type { ParsedTable } from '../lib/parseCsv'
import { detectColumnTypes } from '../lib/detectColumnTypes'
import { emptyFilters, filterRows, type RowFilters } from '../lib/filterRows'
import Filters from './Filters'
import ChartsSection from './ChartsSection'
import DataTable from './DataTable'

type DashboardProps = {
  table: ParsedTable
}

function Dashboard({ table }: DashboardProps) {
  const [filters, setFilters] = useState<RowFilters>(emptyFilters)

  const columns = useMemo(() => detectColumnTypes(table), [table])
  const dateColumn = columns.find((column) => column.type === 'date')?.name

  const filtered = useMemo(
    () => filterRows(table, dateColumn, filters),
    [table, dateColumn, filters],
  )

  return (
    <div>
      <Filters
        table={table}
        columns={columns}
        filters={filters}
        onChange={setFilters}
      />

      {filtered.rows.length === 0 ? (
        <p>За цими фільтрами даних немає.</p>
      ) : (
        <>
          <ChartsSection table={filtered} />
          <DataTable table={filtered} />
        </>
      )}
    </div>
  )
}

export default Dashboard