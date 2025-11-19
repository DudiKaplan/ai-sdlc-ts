# Input Validation Security Rule

## Rule

**All user input MUST be validated on the server, regardless of client-side validation.**

Client-side validation is for user experience only. Server-side validation is for security.

## Why This Matters

1. **Clients are untrusted** - Users can bypass client-side validation using browser dev tools or API clients
2. **Prevents injection attacks** - SQL injection, XSS, command injection
3. **Maintains data integrity** - Ensures only valid data enters your database
4. **Protects business logic** - Prevents invalid operations that could corrupt data

## Implementation in Remult

### Entity-Level Validation

```typescript
import { Entity, Fields, Validators } from 'remult'

@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
})
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string({
    validate: (task) => {
      // Custom validation
      if (task.title.length < 3) {
        throw new Error('Title must be at least 3 characters')
      }
      if (task.title.length > 200) {
        throw new Error('Title cannot exceed 200 characters')
      }
      // Check for malicious content
      if (/<script|javascript:/i.test(task.title)) {
        throw new Error('Invalid characters in title')
      }
    },
  })
  @Validators.required()
  @Validators.maxLength(200)
  title = ''

  @Fields.string({
    validate: (task) => {
      if (task.description && task.description.length > 2000) {
        throw new Error('Description too long')
      }
    },
  })
  description = ''

  @Fields.number({
    validate: (task) => {
      if (task.priority < 1 || task.priority > 5) {
        throw new Error('Priority must be between 1 and 5')
      }
    },
  })
  priority = 1

  @Fields.date({
    validate: (task) => {
      if (task.dueDate && task.dueDate < new Date()) {
        throw new Error('Due date cannot be in the past')
      }
    },
  })
  dueDate?: Date
}
```

### Built-in Validators

```typescript
import { Validators } from 'remult'

export class User {
  @Fields.string()
  @Validators.required()
  @Validators.maxLength(100)
  name = ''

  @Fields.string()
  @Validators.required()
  @Validators.email()
  @Validators.maxLength(200)
  email = ''

  @Fields.number()
  @Validators.required()
  @Validators.min(0)
  @Validators.max(150)
  age = 0

  @Fields.string()
  @Validators.required()
  @Validators.matches(/^[a-zA-Z0-9_-]{3,20}$/, 'Invalid username format')
  username = ''

  @Fields.string()
  @Validators.url()
  website = ''
}
```

### Backend Method Validation

```typescript
export class Task {
  @BackendMethod({ allowed: Allow.authenticated })
  static async assignTask(
    taskId: string,
    userId: string,
    remult?: Remult
  ): Promise<Task> {
    // Validate inputs
    if (!taskId || typeof taskId !== 'string') {
      throw new Error('Invalid task ID')
    }

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID')
    }

    // Validate format (if using specific ID format)
    if (!/^[a-z0-9]{20,25}$/.test(taskId)) {
      throw new Error('Invalid task ID format')
    }

    // Check authorization
    const currentUser = remult!.user!
    if (!currentUser.roles?.includes('admin')) {
      throw new Error('Unauthorized')
    }

    // Verify entities exist
    const task = await remult!.repo(Task).findId(taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    const user = await remult!.repo(User).findId(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Perform operation
    task.userId = userId
    return await remult!.repo(Task).save(task)
  }
}
```

## Common Validation Patterns

### Email Validation

```typescript
@Fields.string({
  validate: (user) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user.email)) {
      throw new Error('Invalid email format')
    }
  },
})
@Validators.email() // Also use built-in
email = ''
```

### URL Validation

```typescript
@Fields.string({
  validate: (entity) => {
    if (!entity.url) return

    try {
      new URL(entity.url)
    } catch {
      throw new Error('Invalid URL')
    }

    // Only allow https
    if (!entity.url.startsWith('https://')) {
      throw new Error('URL must use HTTPS')
    }
  },
})
url = ''
```

### Date Range Validation

```typescript
@Fields.date({
  validate: (event) => {
    if (event.startDate >= event.endDate) {
      throw new Error('End date must be after start date')
    }

    const now = new Date()
    if (event.startDate < now) {
      throw new Error('Start date cannot be in the past')
    }

    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 2)
    if (event.startDate > maxDate) {
      throw new Error('Cannot schedule events more than 2 years in advance')
    }
  },
})
startDate = new Date()
```

### File Upload Validation

```typescript
interface FileUpload {
  filename: string
  size: number
  mimetype: string
}

function validateFileUpload(file: FileUpload): void {
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type')
  }

  // Check filename
  const filenameRegex = /^[a-zA-Z0-9_-]+\.[a-z]{2,5}$/
  if (!filenameRegex.test(file.filename)) {
    throw new Error('Invalid filename')
  }

  // Prevent path traversal
  if (file.filename.includes('..') || file.filename.includes('/')) {
    throw new Error('Invalid filename')
  }
}
```

### Enum Validation

```typescript
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Fields.string({
  validate: (task) => {
    const validStatuses = Object.values(TaskStatus)
    if (!validStatuses.includes(task.status as TaskStatus)) {
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`)
    }
  },
})
status: TaskStatus = TaskStatus.TODO
```

## Sanitization

In addition to validation, sanitize input when necessary:

```typescript
import DOMPurify from 'dompurify'

@Fields.string({
  validate: (task) => {
    // Trim whitespace
    task.title = task.title.trim()

    // Remove dangerous HTML
    if (task.description) {
      task.description = DOMPurify.sanitize(task.description)
    }

    // Normalize unicode
    task.title = task.title.normalize('NFC')
  },
})
title = ''
```

## SQL Injection Prevention

Remult automatically uses parameterized queries, preventing SQL injection:

```typescript
// This is SAFE - Remult uses parameters
const tasks = await remult.repo(Task).find({
  where: {
    title: { $contains: userInput }, // Parameterized automatically
  },
})

// If using raw SQL (rare), use parameters
import { pool } from '../db/connection'

const result = await pool.query(
  'SELECT * FROM tasks WHERE user_id = $1 AND status = $2',
  [userId, status] // Parameters - SAFE
)

// NEVER do this:
// const query = `SELECT * FROM tasks WHERE user_id = ${userId}` // DANGEROUS!
```

## XSS Prevention

React escapes output by default, but validate input too:

```typescript
@Fields.string({
  validate: (task) => {
    // Detect script tags
    if (/<script|javascript:|onerror|onload/i.test(task.title)) {
      throw new Error('Invalid characters detected')
    }
  },
})
title = ''

// When rendering (React does this automatically)
function TaskItem({ task }: { task: Task }) {
  return <h3>{task.title}</h3> // Safe - React escapes
}
```

## Type Guards for Runtime Safety

```typescript
function isValidTask(data: unknown): data is Task {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const task = data as Partial<Task>

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    task.title.length >= 3 &&
    task.title.length <= 200 &&
    typeof task.completed === 'boolean'
  )
}

// Use in API handler
app.post('/api/tasks', async (req, res) => {
  if (!isValidTask(req.body)) {
    return res.status(400).json({ error: 'Invalid task data' })
  }

  // Now safe to use req.body as Task
  const task = await remult.repo(Task).save(req.body)
  res.json(task)
})
```

## Error Messages

Return safe error messages that don't leak sensitive information:

```typescript
// Bad - leaks information
catch (error) {
  res.status(500).json({ error: error.message }) // Might expose DB structure
}

// Good - safe error message
catch (error) {
  console.error('Task creation failed:', error) // Log full error
  res.status(500).json({ error: 'Failed to create task' }) // Generic message
}

// Better - categorize errors
catch (error) {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message }) // Safe to show
  } else {
    console.error('Unexpected error:', error)
    res.status(500).json({ error: 'An unexpected error occurred' })
  }
}
```

## Testing Validation

Always test validation rules:

```typescript
describe('Task validation', () => {
  it('should reject empty title', async () => {
    const task = new Task()
    task.title = ''

    await expect(remult.repo(Task).save(task)).rejects.toThrow('required')
  })

  it('should reject title with script tags', async () => {
    const task = new Task()
    task.title = '<script>alert("xss")</script>'

    await expect(remult.repo(Task).save(task)).rejects.toThrow()
  })

  it('should accept valid task', async () => {
    const task = new Task()
    task.title = 'Valid Task Title'

    const saved = await remult.repo(Task).save(task)
    expect(saved.id).toBeDefined()
  })
})
```

## Summary

**Never trust client input. Always validate on the server.**

This is your first and most important line of defense against security vulnerabilities.
