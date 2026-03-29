import { useState, FormEvent } from 'react'
import { Todo, Priority } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, text: string, priority: Priority, dueDate: string | null) => void
}

const PRIORITY_LABEL: Record<Priority, string> = { high: '高', medium: '中', low: '低' }
const PRIORITY_CLASS: Record<Priority, string> = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function isOverdue(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr + 'T00:00:00') < today
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '')

  function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editText.trim()) return
    onUpdate(todo.id, editText, editPriority, editDueDate || null)
    setEditing(false)
  }

  function handleCancel() {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate ?? '')
    setEditing(false)
  }

  const overdue = !todo.completed && todo.dueDate && isOverdue(todo.dueDate)

  if (editing) {
    return (
      <li className="todo-item editing">
        <form onSubmit={handleSave} className="edit-form">
          <input
            className="edit-text"
            autoFocus
            value={editText}
            onChange={e => setEditText(e.target.value)}
          />
          <div className="edit-options">
            <select
              className="priority-select"
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as Priority)}
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <input
              className="date-input"
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button className="save-btn" type="submit" disabled={!editText.trim()}>
              保存
            </button>
            <button className="cancel-btn" type="button" onClick={handleCancel}>
              キャンセル
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button
        className={`checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && <span className="checkmark">&#10003;</span>}
      </button>

      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        <div className="todo-meta">
          <span className={`priority-badge ${PRIORITY_CLASS[todo.priority]}`}>
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className={`due-date ${overdue ? 'overdue' : ''}`}>
              {overdue ? '期限切れ ' : ''}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="edit-btn"
          onClick={() => setEditing(true)}
          aria-label="編集"
        >
          &#9998;
        </button>
        <button
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
          aria-label="削除"
        >
          &#10005;
        </button>
      </div>
    </li>
  )
}
