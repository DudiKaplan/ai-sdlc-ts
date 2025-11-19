import type { Task } from '../../shared/entities/Task'

const API_BASE = '/api'

export const api = {
  tasks: {
    getAll: async (): Promise<Task[]> => {
      const response = await fetch(`${API_BASE}/tasks`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    },

    getOne: async (id: string): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`)
      if (!response.ok) throw new Error('Failed to fetch task')
      return response.json()
    },

    create: async (task: Partial<Task>): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error('Failed to create task')
      return response.json()
    },

    update: async (id: string, task: Partial<Task>): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error('Failed to update task')
      return response.json()
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
    },
  },
}
