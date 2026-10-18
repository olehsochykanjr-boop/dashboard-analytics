import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type CategoryChartProps = {
  title: string
  data: { label: string; value: number }[]
  controls?: ReactNode
}

function CategoryChart({ title, data, controls }: CategoryChartProps) {
  return (
    <section className="card">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        {controls}
      </div>
      <div className="chart-box">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default CategoryChart