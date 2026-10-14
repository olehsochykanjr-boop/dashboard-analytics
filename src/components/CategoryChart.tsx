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
}

function CategoryChart({ title, data }: CategoryChartProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#646cff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default CategoryChart