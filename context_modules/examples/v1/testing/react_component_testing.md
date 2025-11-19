# React Component Testing Examples

## Overview

This guide demonstrates best practices for testing React components in our TypeScript fullstack application.

## Setup

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock data helpers
export function createMockTask(overrides?: Partial<Task>): Task {
  return {
    id: 'test-id',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
```

## Testing Presentational Components

```typescript
// TaskItem.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'
import { createMockTask } from '../test-utils'

describe('TaskItem', () => {
  it('should render task title', () => {
    const task = createMockTask({ title: 'Buy groceries' })

    render(<TaskItem task={task} onComplete={() => {}} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('should show completed status', () => {
    const task = createMockTask({ completed: true })

    render(<TaskItem task={task} onComplete={() => {}} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should call onComplete when checkbox is clicked', async () => {
    const task = createMockTask()
    const onComplete = jest.fn()

    render(<TaskItem task={task} onComplete={onComplete} />)

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    expect(onComplete).toHaveBeenCalledWith(task.id)
  })

  it('should show description when present', () => {
    const task = createMockTask({ description: 'At the farmers market' })

    render(<TaskItem task={task} onComplete={() => {}} />)

    expect(screen.getByText('At the farmers market')).toBeInTheDocument()
  })

  it('should not render description when empty', () => {
    const task = createMockTask({ description: undefined })

    render(<TaskItem task={task} onComplete={() => {}} />)

    expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    const task = createMockTask()

    render(<TaskItem task={task} onComplete={() => {}} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAccessibleName()
  })
})
```

## Testing Container Components with Data Fetching

```typescript
// TaskList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from './TaskList'
import { remult } from 'remult'
import { Task } from '@shared/entities/Task'

// Mock Remult
jest.mock('remult', () => ({
  remult: {
    repo: jest.fn(),
  },
}))

describe('TaskList', () => {
  const mockTasks = [
    createMockTask({ id: '1', title: 'Task 1' }),
    createMockTask({ id: '2', title: 'Task 2' }),
  ]

  beforeEach(() => {
    // Setup mock repository
    const mockRepo = {
      find: jest.fn().mockResolvedValue(mockTasks),
      save: jest.fn(),
      delete: jest.fn(),
    }
    ;(remult.repo as jest.Mock).mockReturnValue(mockRepo)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    render(<TaskList userId="user-1" />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render tasks after loading', async () => {
    render(<TaskList userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })
  })

  it('should filter tasks by status', async () => {
    const findMock = jest.fn().mockResolvedValue([mockTasks[0]])
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: findMock,
    })

    render(<TaskList userId="user-1" filter="active" />)

    await waitFor(() => {
      expect(findMock).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: 'user-1',
          completed: false,
        }),
      })
    })
  })

  it('should handle empty state', async () => {
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue([]),
    })

    render(<TaskList userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })
  })

  it('should handle error state', async () => {
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error('Failed to load')),
    })

    render(<TaskList userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })

  it('should complete task when clicked', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockTasks[0])
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue(mockTasks),
      save: saveMock,
    })

    render(<TaskList userId="user-1" />)

    await waitFor(() => screen.getByText('Task 1'))

    const checkbox = screen.getAllByRole('checkbox')[0]
    await userEvent.click(checkbox)

    expect(saveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        completed: true,
      })
    )
  })
})
```

## Testing Custom Hooks

```typescript
// useTasks.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useTasks } from './useTasks'
import { remult } from 'remult'
import { createMockTask } from '../test-utils'

jest.mock('remult')

describe('useTasks', () => {
  const mockTasks = [createMockTask(), createMockTask()]

  beforeEach(() => {
    const mockRepo = {
      find: jest.fn().mockResolvedValue(mockTasks),
      insert: jest.fn(),
      save: jest.fn(),
    }
    ;(remult.repo as jest.Mock).mockReturnValue(mockRepo)
  })

  it('should load tasks on mount', async () => {
    const { result } = renderHook(() => useTasks('user-1'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.tasks).toEqual(mockTasks)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to load')
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: jest.fn().mockRejectedValue(error),
    })

    const { result } = renderHook(() => useTasks('user-1'))

    await waitFor(() => {
      expect(result.current.error).toEqual(error)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.tasks).toEqual([])
  })

  it('should add task', async () => {
    const newTask = createMockTask({ title: 'New Task' })
    const insertMock = jest.fn().mockResolvedValue(newTask)
    ;(remult.repo as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue(mockTasks),
      insert: insertMock,
    })

    const { result } = renderHook(() => useTasks('user-1'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.addTask({ title: 'New Task' })

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        userId: 'user-1',
      })
    )

    expect(result.current.tasks).toContainEqual(newTask)
  })
})
```

## Testing Forms

```typescript
// TaskForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('should render form fields', () => {
    render(<TaskForm onSubmit={() => {}} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const onSubmit = jest.fn()
    render(<TaskForm onSubmit={onSubmit} />)

    const submitButton = screen.getByRole('button', { name: /create/i })
    await userEvent.click(submitButton)

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit valid form', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)

    await userEvent.type(titleInput, 'New Task')
    await userEvent.type(descriptionInput, 'Task description')

    const submitButton = screen.getByRole('button', { name: /create/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
      })
    })
  })

  it('should show validation error for short title', async () => {
    render(<TaskForm onSubmit={() => {}} />)

    const titleInput = screen.getByLabelText(/title/i)
    await userEvent.type(titleInput, 'ab')
    await userEvent.tab() // Blur event

    expect(
      await screen.findByText(/title must be at least 3 characters/i)
    ).toBeInTheDocument()
  })

  it('should clear form after submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement

    await userEvent.type(titleInput, 'New Task')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(titleInput.value).toBe('')
    })
  })

  it('should show loading state during submission', async () => {
    const onSubmit = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    render(<TaskForm onSubmit={onSubmit} />)

    const titleInput = screen.getByLabelText(/title/i)
    await userEvent.type(titleInput, 'New Task')

    const submitButton = screen.getByRole('button', { name: /create/i })
    await userEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/creating/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })
})
```

## Testing Async Operations

```typescript
// TaskService.test.ts
import { TaskService } from './TaskService'
import { remult } from 'remult'
import { createMockTask } from '../test-utils'

jest.mock('remult')

describe('TaskService', () => {
  let taskService: TaskService

  beforeEach(() => {
    taskService = new TaskService()
  })

  describe('bulkComplete', () => {
    it('should complete multiple tasks', async () => {
      const tasks = [
        createMockTask({ id: '1', completed: false }),
        createMockTask({ id: '2', completed: false }),
      ]

      const saveMock = jest.fn().mockImplementation(task =>
        Promise.resolve({ ...task, completed: true })
      )
      ;(remult.repo as jest.Mock).mockReturnValue({
        findId: jest.fn(id => tasks.find(t => t.id === id)),
        save: saveMock,
      })

      const result = await taskService.bulkComplete(['1', '2'])

      expect(result.successCount).toBe(2)
      expect(result.failedCount).toBe(0)
      expect(saveMock).toHaveBeenCalledTimes(2)
    })

    it('should handle partial failures', async () => {
      const saveMock = jest
        .fn()
        .mockResolvedValueOnce({ id: '1', completed: true })
        .mockRejectedValueOnce(new Error('Failed'))

      ;(remult.repo as jest.Mock).mockReturnValue({
        findId: jest.fn(id =>
          Promise.resolve(createMockTask({ id, completed: false }))
        ),
        save: saveMock,
      })

      const result = await taskService.bulkComplete(['1', '2'])

      expect(result.successCount).toBe(1)
      expect(result.failedCount).toBe(1)
      expect(result.errors).toHaveLength(1)
    })
  })
})
```

## Summary

These testing patterns ensure:
- Components behave correctly
- User interactions work as expected
- Data fetching and mutations are handled properly
- Error states are displayed appropriately
- Forms validate and submit correctly
- Accessibility is maintained
