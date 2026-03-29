import { FilterType } from '../types'

interface Props {
  filter: FilterType
  onChange: (f: FilterType) => void
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

export default function FilterBar({ filter, onChange }: Props) {
  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-btn ${filter === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
