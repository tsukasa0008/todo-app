import { useState, useEffect } from 'react'
import { Todo, Priority } from './types'

const STORAGE_KEY = 'todo-app-v1'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  function addTodo(text: string, priority: Priority, dueDate: string | null) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    }
    setTodos(prev => [todo, ...prev])
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function updateTodo(id: string, text: string, priority: Priority, dueDate: string | null) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: text.trim(), priority, dueDate } : t))
    )
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  return { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted }
}
