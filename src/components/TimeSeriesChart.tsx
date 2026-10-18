import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SeriesPoint } from '../lib/aggregate'

type TimeSeriesChartProps = {
  title: string
  valueLabel: string
  data: SeriesPoint[]
}

function TimeSeriesChart({ title, valueLabel, data }: TimeSeriesChartProps) {
  return (
    <section className="card">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
      </div>
      <div className="chart-box">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TimeSeriesChart