import type { Summary } from '../lib/stats'

type StatCardsProps = {
  summary: Summary
  label: string
}

const format = (value: number) =>
  value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })

function StatCards({ summary, label }: StatCardsProps) {
  const cards = [
    { title: `Сума (${label})`, value: format(summary.total) },
    { title: 'Середнє', value: format(summary.average) },
    { title: 'Максимум', value: format(summary.max) },
    { title: 'Записів', value: format(summary.count) },
  ]

  return (
    <div className="stats">
      {cards.map((card) => (
        <div key={card.title} className="stat-card">
          <span className="stat-title">{card.title}</span>
          <span className="stat-value">{card.value}</span>
        </div>
      ))}
    </div>
  )
}

export default StatCards