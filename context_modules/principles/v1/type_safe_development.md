# Type-Safe Development Principle

## Overview

Type safety is not just a feature—it's a foundational principle that reduces bugs, improves maintainability, and enables confident refactoring. By leveraging TypeScript's type system throughout the entire stack, we catch errors at compile time rather than in production.

## Core Tenets

### 1. Strict TypeScript Configuration

Use the strictest TypeScript settings to maximize safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. Share Types Between Client and Server

Place shared types in `src/shared/` to ensure consistency:

```typescript
// src/shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// Use in both client and server
import { ApiResponse } from '@shared/types/api'
```

### 3. Avoid `any` - Use Proper Types

```typescript
// Bad
function processData(data: any) {
  return data.value // No type safety!
}

// Good
interface DataInput {
  value: string
}

function processData(data: DataInput): string {
  return data.value // Type-safe!
}

// When type is truly unknown, use 'unknown'
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

### 4. Use Discriminated Unions for State

```typescript
// Excellent for managing complex state
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function TaskList() {
  const [state, setState] = useState<RequestState<Task[]>>({ status: 'idle' })

  // TypeScript ensures we handle all cases
  switch (state.status) {
    case 'idle':
      return <div>Click to load</div>
    case 'loading':
      return <LoadingSpinner />
    case 'success':
      return <TaskItems tasks={state.data} />
    case 'error':
      return <ErrorMessage error={state.error} />
  }
}
```

### 5. Leverage Remult's Type Inference

Remult provides end-to-end type safety from database to UI:

```typescript
// Define entity once
@Entity('tasks')
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.boolean()
  completed = false
}

// Automatically get type-safe API
const tasks = await remult.repo(Task).find() // tasks is Task[]
const task = await remult.repo(Task).findId('123') // task is Task | undefined
```

### 6. Use Generic Types for Reusability

```typescript
// Generic repository pattern
interface Repository<T> {
  find(query?: QueryOptions): Promise<T[]>
  findById(id: string): Promise<T | undefined>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}

// Generic response wrapper
interface Result<T, E = Error> {
  success: boolean
  data?: T
  error?: E
}

async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}
```

### 7. Type Guards for Runtime Safety

```typescript
// Type guard functions
function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  )
}

// Use in practice
function processApiResponse(response: unknown) {
  if (isTask(response)) {
    // TypeScript knows response is Task here
    console.log(response.title)
  }
}

// Remult validation
@Entity('tasks')
export class Task {
  @Fields.string({
    validate: (value) => {
      if (value.length < 3) {
        throw new Error('Title must be at least 3 characters')
      }
    },
  })
  title = ''
}
```

### 8. Utility Types for Transformations

```typescript
// Pick only specific fields
type TaskSummary = Pick<Task, 'id' | 'title' | 'completed'>

// Make all fields optional
type PartialTask = Partial<Task>

// Make all fields required
type RequiredTask = Required<Task>

// Omit specific fields
type TaskWithoutTimestamps = Omit<Task, 'createdAt' | 'updatedAt'>

// Create types from other types
type TaskStatus = Task['status'] // Gets the type of status field
```

### 9. Strongly Type React Props and State

```typescript
// Component props
interface TaskItemProps {
  task: Task
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => Promise<void>
  className?: string
}

export function TaskItem({ task, onComplete, onDelete, className }: TaskItemProps) {
  // TypeScript ensures all required props are provided
}

// State with proper typing
interface TaskListState {
  tasks: Task[]
  selectedId: string | null
  filter: 'all' | 'active' | 'completed'
  isLoading: boolean
}

const [state, setState] = useState<TaskListState>({
  tasks: [],
  selectedId: null,
  filter: 'all',
  isLoading: false,
})
```

### 10. Type-Safe Environment Variables

```typescript
// src/server/config.ts
interface Config {
  database: {
    host: string
    port: number
    name: string
    user: string
    password: string
  }
  server: {
    port: number
    nodeEnv: 'development' | 'production' | 'test'
  }
}

function getConfig(): Config {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  return {
    database: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      name: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: (process.env.NODE_ENV as Config['server']['nodeEnv']) || 'development',
    },
  }
}

export const config = getConfig()
```

## Benefits

### 1. Catch Errors Early
- Type errors are caught at compile time, not runtime
- IDE shows errors as you type
- Refactoring is safer and more confident

### 2. Better Developer Experience
- Excellent autocomplete and IntelliSense
- Inline documentation with JSDoc
- Easier to understand code intent

### 3. Self-Documenting Code
- Types serve as inline documentation
- Function signatures clearly show expectations
- Less need for comments explaining structure

### 4. Easier Refactoring
- TypeScript shows all places that need updates
- Rename refactoring is safe and comprehensive
- Breaking changes are immediately visible

### 5. Team Collaboration
- Clear contracts between modules
- Reduces ambiguity in code
- New team members onboard faster

## Common Pitfalls to Avoid

### 1. Overusing `any`
```typescript
// Bad
const data: any = await fetchData()

// Good
interface ApiData {
  // define structure
}
const data: ApiData = await fetchData()
```

### 2. Not Using Strict Mode
```typescript
// Bad - loose TypeScript doesn't catch many issues
// Good - enable strict mode in tsconfig.json
```

### 3. Type Assertions Without Validation
```typescript
// Bad
const task = data as Task // Unsafe!

// Good
function isTask(data: unknown): data is Task {
  // validation logic
}
if (isTask(data)) {
  // now safe to use as Task
}
```

### 4. Ignoring Null/Undefined
```typescript
// Bad
function getTaskTitle(task: Task | undefined) {
  return task.title // Might crash!
}

// Good
function getTaskTitle(task: Task | undefined): string | undefined {
  return task?.title
}
```

## Summary

Type safety is a multiplier for developer productivity and code quality. By embracing TypeScript's type system fully, we build more reliable software with fewer bugs and better maintainability.
