# TypeScript Style Guide

## Overview

This style guide ensures consistency across our TypeScript codebase. It covers TypeScript-specific patterns, React conventions, and general code organization.

## File Organization

### File Naming

```
# Components - PascalCase
TaskList.tsx
UserProfile.tsx
Button.tsx

# Utilities/Services - camelCase
taskService.ts
dateUtils.ts
apiClient.ts

# Types/Interfaces - PascalCase
Task.ts
User.ts
ApiTypes.ts

# Constants - UPPER_SNAKE_CASE or camelCase
constants.ts
config.ts
```

### Directory Structure

```
src/
├── client/
│   ├── components/        # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── TaskList/
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       └── index.ts
│   ├── routes/           # TanStack Router routes
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── tasks.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useTasks.ts
│   │   └── useAuth.ts
│   └── utils/            # Client-side utilities
│       ├── formatting.ts
│       └── validation.ts
├── server/
│   ├── api/              # API endpoints
│   │   └── remult.ts
│   ├── db/               # Database configuration
│   │   └── connection.ts
│   └── services/         # Business logic
│       └── taskService.ts
└── shared/
    ├── entities/         # Remult entities
    │   ├── Task.ts
    │   └── User.ts
    ├── types/            # Shared types
    │   └── api.ts
    └── utils/            # Shared utilities
        └── constants.ts
```

## TypeScript Conventions

### Types vs Interfaces

Use interfaces for object shapes, types for unions and complex types:

```typescript
// Interfaces for object shapes
interface User {
  id: string
  name: string
  email: string
}

interface TaskListProps {
  userId: string
  onComplete: (id: string) => void
}

// Types for unions, intersections, and utilities
type Status = 'idle' | 'loading' | 'success' | 'error'

type Result<T> = { success: true; data: T } | { success: false; error: string }

type Optional<T> = T | null | undefined

// Extending interfaces
interface Admin extends User {
  permissions: string[]
}

// Combining types
type UserWithTasks = User & {
  tasks: Task[]
}
```

### Explicit Return Types

Always specify return types for functions:

```typescript
// Good - explicit return type
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

async function fetchTasks(): Promise<Task[]> {
  return await remult.repo(Task).find()
}

// Acceptable for simple cases where inference is obvious
const add = (a: number, b: number) => a + b // inferred as number
```

### Avoid `any`

Use proper types or `unknown` instead:

```typescript
// Bad
function processData(data: any) {
  return data.value
}

// Good
interface DataInput {
  value: string
}

function processData(data: DataInput): string {
  return data.value
}

// When type is truly unknown
function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown error', error)
  }
}
```

### Null Safety

Handle null and undefined explicitly:

```typescript
// Use optional chaining
const title = task?.title
const firstTask = tasks?.[0]

// Use nullish coalescing
const displayName = user.name ?? 'Anonymous'

// Type guards
function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  )
}

if (isTask(data)) {
  // TypeScript knows data is Task here
  console.log(data.title)
}
```

### Generics

Use generics for reusable, type-safe code:

```typescript
// Generic function
function first<T>(array: T[]): T | undefined {
  return array[0]
}

const firstTask = first(tasks) // Task | undefined
const firstNumber = first([1, 2, 3]) // number | undefined

// Generic interface
interface Repository<T> {
  find(): Promise<T[]>
  findById(id: string): Promise<T | undefined>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}

// Generic component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## React Conventions

### Component Structure

```typescript
import { useState, useEffect, useCallback } from 'react'

// Props interface
interface TaskListProps {
  userId: string
  filter?: 'all' | 'active' | 'completed'
  onTaskComplete?: (taskId: string) => void
}

// Component
export function TaskList({ userId, filter = 'all', onTaskComplete }: TaskListProps) {
  // 1. State
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. Effects
  useEffect(() => {
    loadTasks()
  }, [userId, filter])

  // 3. Handlers
  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await remult.repo(Task).find({
        where: { userId, status: filter === 'all' ? undefined : filter },
      })
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId, filter])

  const handleComplete = useCallback(
    (taskId: string) => {
      onTaskComplete?.(taskId)
    },
    [onTaskComplete]
  )

  // 4. Early returns
  if (isLoading) return <LoadingSpinner />
  if (tasks.length === 0) return <EmptyState />

  // 5. Main render
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onComplete={handleComplete} />
      ))}
    </div>
  )
}
```

### Hooks

Custom hooks should start with `use`:

```typescript
// Custom hook
export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await remult.repo(Task).find({ where: { userId } })
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [userId])

  const addTask = useCallback(
    async (taskData: Partial<Task>) => {
      const task = await remult.repo(Task).insert({ ...taskData, userId })
      setTasks(prev => [...prev, task])
      return task
    },
    [userId]
  )

  return { tasks, isLoading, error, addTask }
}

// Usage
function TaskListContainer() {
  const { tasks, isLoading, addTask } = useTasks(userId)
  // ...
}
```

## Naming Conventions

### Variables and Functions

```typescript
// Variables - camelCase
const userName = 'John'
const taskList = []
const isLoading = true

// Functions - camelCase, descriptive verbs
function calculateTotal() { }
function handleClick() { }
function validateEmail() { }

// Boolean variables/functions - is/has/can prefix
const isValid = true
const hasPermission = false
const canEdit = true

function isAuthenticated(): boolean { }
function hasRole(role: string): boolean { }
```

### Components and Classes

```typescript
// Components - PascalCase
function TaskList() { }
function UserProfile() { }

// Classes - PascalCase
class TaskService { }
class ApiClient { }

// Enums - PascalCase
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}
```

### Constants

```typescript
// Constants - UPPER_SNAKE_CASE or camelCase
const MAX_RETRIES = 3
const API_ENDPOINT = '/api/tasks'
const DEFAULT_TIMEOUT = 5000

// Configuration objects - camelCase
const apiConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
}
```

## Code Organization

### Imports

Organize imports in this order:

```typescript
// 1. External libraries
import { useState, useEffect } from 'react'
import { remult } from 'remult'

// 2. Internal modules (using path aliases)
import { Task } from '@shared/entities/Task'
import { Button } from '@client/components/Button'
import { formatDate } from '@shared/utils/date'

// 3. Relative imports
import { TaskItem } from './TaskItem'
import { useTaskFilter } from './useTaskFilter'

// 4. Types (if using type-only imports)
import type { TaskListProps } from './types'
```

### Exports

```typescript
// Named exports (preferred for most cases)
export function TaskList() { }
export function TaskItem() { }

// Default export (use sparingly, mainly for pages/routes)
export default function HomePage() { }

// Export types
export type { TaskListProps, TaskItemProps }

// Re-exports
export { Task } from '@shared/entities/Task'
export * from './components'
```

## Comments and Documentation

### JSDoc for Public APIs

```typescript
/**
 * Fetches tasks for a specific user with optional filtering.
 *
 * @param userId - The ID of the user
 * @param options - Optional filtering and sorting options
 * @returns Promise resolving to an array of tasks
 * @throws {NotFoundError} if user doesn't exist
 * @throws {UnauthorizedError} if user lacks permission
 *
 * @example
 * ```typescript
 * const tasks = await fetchUserTasks('user123', {
 *   status: 'active',
 *   sortBy: 'createdAt'
 * })
 * ```
 */
export async function fetchUserTasks(
  userId: string,
  options?: TaskQueryOptions
): Promise<Task[]> {
  // Implementation
}
```

### Inline Comments

```typescript
// Use comments to explain WHY, not WHAT
function calculateDiscount(price: number, userType: string): number {
  // Premium users get 20% discount to encourage retention
  if (userType === 'premium') {
    return price * 0.8
  }

  // Bad comment (explains what, which is obvious):
  // return the original price
  return price
}
```

### TODOs

```typescript
// TODO: Add pagination support
// FIXME: Race condition when multiple users edit same task
// HACK: Temporary workaround for API limitation
// NOTE: This behavior matches legacy system for compatibility
```

## Error Handling

### Try-Catch

```typescript
async function loadTasks(): Promise<Task[]> {
  try {
    const tasks = await remult.repo(Task).find()
    return tasks
  } catch (error) {
    // Log full error
    console.error('Failed to load tasks:', error)

    // Handle specific error types
    if (error instanceof ValidationError) {
      throw new Error('Invalid task data')
    }

    // Re-throw or return safe default
    throw new Error('Failed to load tasks')
  }
}
```

### Result Type Pattern

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

async function safeFetchTasks(): Promise<Result<Task[]>> {
  try {
    const tasks = await remult.repo(Task).find()
    return { success: true, data: tasks }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}

// Usage
const result = await safeFetchTasks()
if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error)
}
```

## Testing

### Test File Naming

```
TaskList.test.tsx
taskService.test.ts
dateUtils.test.ts
```

### Test Structure

```typescript
describe('TaskList component', () => {
  // Setup
  beforeEach(() => {
    // Clear mocks, reset state
  })

  // Grouped tests
  describe('rendering', () => {
    it('should display loading spinner when loading', () => {
      // Arrange
      const props = { isLoading: true, tasks: [] }

      // Act
      render(<TaskList {...props} />)

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should display tasks when loaded', () => {
      const tasks = [createMockTask(), createMockTask()]
      render(<TaskList isLoading={false} tasks={tasks} />)

      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('interactions', () => {
    it('should call onComplete when task is clicked', async () => {
      const onComplete = jest.fn()
      const task = createMockTask()

      render(<TaskList tasks={[task]} onComplete={onComplete} />)

      await userEvent.click(screen.getByText(task.title))

      expect(onComplete).toHaveBeenCalledWith(task.id)
    })
  })
})
```

## Summary

Follow these conventions to maintain a clean, consistent, and maintainable TypeScript codebase. When in doubt, prioritize:

1. **Type safety** - Use TypeScript's features fully
2. **Readability** - Code is read more than written
3. **Consistency** - Follow existing patterns in the codebase
4. **Simplicity** - Prefer simple solutions over clever ones
