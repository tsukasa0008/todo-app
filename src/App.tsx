import { useState, useMemo } from 'react'
import { useTodos } from './useTodos'
import { FilterType, Priority, Todo } from './types'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import FilterBar from './components/FilterBar'

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted } = useTodos()
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt')

  const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

  const filteredTodos = useMemo(() => {
    let result = todos

    if (filter === 'active') result = result.filter(t => !t.completed)
    else if (filter === 'completed') result = result.filter(t => t.completed)

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t => t.text.toLowerCase().includes(q))
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      return b.createdAt - a.createdAt
    })
  }, [todos, filter, search, sortBy])

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <header className="header">
        <h1>TODO</h1>
        <p className="subtitle">{activeCount} 件残っています</p>
      </header>

      <main className="main">
        <TodoForm onAdd={addTodo} />

        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">&#128269;</span>
            <input
              className="search"
              type="search"
              placeholder="タスクを検索..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="createdAt">作成日順</option>
            <option value="priority">優先度順</option>
            <option value="dueDate">期限順</option>
          </select>
        </div>

        <FilterBar filter={filter} onChange={setFilter} />

        <ul className="todo-list">
          {filteredTodos.length === 0 && (
            <li className="empty">
              {search ? '検索結果がありません' : filter === 'completed' ? '完了タスクがありません' : 'タスクがありません'}
            </li>
          )}
          {filteredTodos.map((todo: Todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </ul>

        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            完了済み {completedCount} 件を削除
          </button>
        )}
      </main>
    </div>
  )
}
