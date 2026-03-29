import { useState, FormEvent } from 'react'
import { Priority } from '../types'

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string | null) => void
}

export default function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [expanded, setExpanded] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text, priority, dueDate || null)
    setText('')
    setPriority('medium')
    setDueDate('')
    setExpanded(false)
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-main">
        <input
          className="text-input"
          type="text"
          placeholder="新しいタスクを入力..."
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <button className="add-btn" type="submit" disabled={!text.trim()}>
          追加
        </button>
      </div>
      {expanded && (
        <div className="form-options">
          <label className="option-label">
            優先度
            <select
              className="priority-select"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </label>
          <label className="option-label">
            期限
            <input
              className="date-input"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </label>
        </div>
      )}
    </form>
  )
}
