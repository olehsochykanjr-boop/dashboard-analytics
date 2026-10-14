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
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{ border: '1px solid #444', borderRadius: 8, padding: 12 }}
        >
          <small>{card.title}</small>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{card.value}</div>
        </div>
      ))}
    </div>
  )
}

export default StatCards