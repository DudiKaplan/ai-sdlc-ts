import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useState } from 'react'
import type { Task } from '../../shared/entities/Task'

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
})

function TasksComponent() {
  const queryClient = useQueryClient()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  // Fetch all tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: api.tasks.getAll,
  })

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: api.tasks.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setNewTaskTitle('')
      setNewTaskDescription('')
    },
  })

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) =>
      api.tasks.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      createMutation.mutate({
        title: newTaskTitle,
        description: newTaskDescription || undefined,
      })
    }
  }

  const toggleTask = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      completed: !task.completed,
    })
  }

  if (isLoading) return <div>Loading tasks...</div>
  if (error) return <div>Error loading tasks: {error.message}</div>

  return (
    <div>
      <h1>Tasks</h1>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          rows={3}
        />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Add Task'}
        </button>
      </form>

      <div className="task-list" style={{ marginTop: '2rem' }}>
        {tasks?.length === 0 && (
          <p>No tasks yet. Create one above!</p>
        )}
        {tasks?.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h3
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  margin: '0 0 0.5rem 0',
                }}
              >
                {task.title}
              </h3>
              {task.description && (
                <p style={{ margin: 0, opacity: 0.8 }}>{task.description}</p>
              )}
              <small style={{ opacity: 0.6 }}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </small>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => toggleTask(task)}
                disabled={updateMutation.isPending}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteMutation.mutate(task.id)}
                disabled={deleteMutation.isPending}
                style={{ backgroundColor: '#dc2626' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
