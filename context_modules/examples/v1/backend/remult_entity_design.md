# Remult Entity Design Examples

## Overview

This guide demonstrates best practices for designing Remult entities with proper validation, authorization, and business logic.

## Basic Entity

```typescript
import { Entity, Fields, Validators } from 'remult'

@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
})
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  @Validators.maxLength(200)
  title = ''

  @Fields.string()
  @Validators.maxLength(2000)
  description = ''

  @Fields.boolean()
  completed = false

  @Fields.createdAt()
  createdAt = new Date()

  @Fields.updatedAt()
  updatedAt = new Date()
}
```

## Entity with Validation

```typescript
import { Entity, Fields, Validators, Allow } from 'remult'

@Entity('projects', {
  allowApiCrud: Allow.authenticated,
})
export class Project {
  @Fields.cuid()
  id = ''

  @Fields.string({
    validate: (project) => {
      // Custom validation logic
      if (project.name.length < 3) {
        throw new Error('Project name must be at least 3 characters')
      }
      if (!/^[a-zA-Z0-9\s-]+$/.test(project.name)) {
        throw new Error('Project name contains invalid characters')
      }
    },
  })
  @Validators.required()
  @Validators.maxLength(100)
  name = ''

  @Fields.date({
    validate: (project) => {
      if (project.startDate >= project.endDate) {
        throw new Error('End date must be after start date')
      }
      if (project.startDate < new Date()) {
        throw new Error('Start date cannot be in the past')
      }
    },
  })
  @Validators.required()
  startDate = new Date()

  @Fields.date()
  @Validators.required()
  endDate = new Date()

  @Fields.number({
    validate: (project) => {
      if (project.budget < 0) {
        throw new Error('Budget cannot be negative')
      }
      if (project.budget > 10000000) {
        throw new Error('Budget exceeds maximum allowed')
      }
    },
  })
  budget = 0

  @Fields.string()
  @Validators.required()
  @Validators.email()
  ownerEmail = ''

  @Fields.createdAt()
  createdAt = new Date()
}
```

## Entity with Authorization

```typescript
import { Entity, Fields, Allow, BackendMethod, Remult } from 'remult'

enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

@Entity('documents', {
  // Only authenticated users can read
  allowApiRead: Allow.authenticated,

  // Only authors and admins can update
  allowApiUpdate: (remult, document) => {
    return (
      remult.user?.id === document.authorId ||
      remult.user?.roles?.includes(Role.Admin)
    )
  },

  // Only admins can delete
  allowApiDelete: (remult) => remult.user?.roles?.includes(Role.Admin),

  // Anyone can create, but authorId will be set automatically
  allowApiInsert: Allow.authenticated,
})
export class Document {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  title = ''

  @Fields.string()
  content = ''

  // Only owner or admin can see private field
  @Fields.string({
    allowApiUpdate: (remult, document) => {
      return (
        remult.user?.id === document.authorId ||
        remult.user?.roles?.includes(Role.Admin)
      )
    },
  })
  privateNotes = ''

  // Author is set automatically and cannot be changed
  @Fields.string({
    allowApiUpdate: false,
    saving: (document, fieldRef, remult) => {
      if (fieldRef.valueChanged() && !remult?.user?.roles?.includes(Role.Admin)) {
        throw new Error('Cannot change document author')
      }
    },
  })
  authorId = ''

  @Fields.boolean()
  isPublished = false

  @Fields.createdAt()
  createdAt = new Date()

  @Fields.updatedAt()
  updatedAt = new Date()
}
```

## Entity with Relations

```typescript
import { Entity, Fields, Relations } from 'remult'

@Entity('users')
export class User {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  name = ''

  @Fields.string()
  @Validators.required()
  @Validators.email()
  email = ''

  // Virtual field - not stored in DB
  @Relations.toMany<User, Task>(() => Task, 'userId')
  tasks?: Task[]
}

@Entity('tasks')
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.string()
  userId = ''

  // Relation to User
  @Relations.toOne<Task, User>(() => User, 'userId')
  user?: User
}

// Usage
const taskWithUser = await remult.repo(Task).findFirst({
  include: {
    user: true,
  },
})
console.log(taskWithUser.user?.name)

const userWithTasks = await remult.repo(User).findFirst({
  include: {
    tasks: true,
  },
})
console.log(userWithTasks.tasks?.length)
```

## Entity with Backend Methods

```typescript
import { Entity, Fields, BackendMethod, Allow, Remult } from 'remult'

@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
})
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.boolean()
  completed = false

  @Fields.string()
  userId = ''

  @Fields.string()
  assignedTo = ''

  /**
   * Assign task to another user
   * Only task owner or admin can assign
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async assignTask(
    taskId: string,
    targetUserId: string,
    remult?: Remult
  ): Promise<Task> {
    const task = await remult!.repo(Task).findId(taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    // Check authorization
    const currentUser = remult!.user!
    const isOwner = task.userId === currentUser.id
    const isAdmin = currentUser.roles?.includes('admin')

    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized to assign this task')
    }

    // Verify target user exists
    const targetUser = await remult!.repo(User).findId(targetUserId)
    if (!targetUser) {
      throw new Error('Target user not found')
    }

    // Assign task
    task.assignedTo = targetUserId

    return await remult!.repo(Task).save(task)
  }

  /**
   * Bulk complete tasks
   * Returns count of successfully completed tasks
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async bulkComplete(taskIds: string[], remult?: Remult): Promise<number> {
    let completedCount = 0

    for (const taskId of taskIds) {
      try {
        const task = await remult!.repo(Task).findId(taskId)

        if (task && task.userId === remult!.user!.id) {
          task.completed = true
          await remult!.repo(Task).save(task)
          completedCount++
        }
      } catch (error) {
        console.error(`Failed to complete task ${taskId}:`, error)
      }
    }

    return completedCount
  }

  /**
   * Get task statistics for current user
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async getStats(remult?: Remult) {
    const userId = remult!.user!.id

    const allTasks = await remult!.repo(Task).find({
      where: { userId },
    })

    const completed = allTasks.filter(t => t.completed).length
    const active = allTasks.length - completed

    return {
      total: allTasks.length,
      completed,
      active,
      completionRate: allTasks.length > 0 ? completed / allTasks.length : 0,
    }
  }
}
```

## Entity Lifecycle Hooks

```typescript
import { Entity, Fields, EntityBase } from 'remult'

@Entity('audit-logs')
export class AuditLog {
  @Fields.cuid()
  id = ''

  @Fields.string()
  entityType = ''

  @Fields.string()
  entityId = ''

  @Fields.string()
  action = ''

  @Fields.string()
  userId = ''

  @Fields.json()
  changes?: any

  @Fields.createdAt()
  createdAt = new Date()
}

@Entity('products', {
  allowApiCrud: Allow.authenticated,
  saving: async (product, remult) => {
    // Runs before save
    // Validate business rules
    if (product.price < 0) {
      throw new Error('Price cannot be negative')
    }

    // Set computed fields
    product.slug = product.name.toLowerCase().replace(/\s+/g, '-')

    // Audit log
    await remult.repo(AuditLog).insert({
      entityType: 'Product',
      entityId: product.id,
      action: product.id ? 'update' : 'create',
      userId: remult.user?.id || 'system',
      changes: product,
    })
  },
  saved: async (product, remult) => {
    // Runs after successful save
    console.log(`Product ${product.id} was saved`)

    // Trigger other processes
    // await notifySubscribers(product)
  },
  deleting: async (product, remult) => {
    // Runs before delete
    // Check if deletion is allowed
    const hasOrders = await remult.repo(Order).count({
      where: { productId: product.id },
    })

    if (hasOrders > 0) {
      throw new Error('Cannot delete product with existing orders')
    }
  },
  deleted: async (product, remult) => {
    // Runs after successful delete
    await remult.repo(AuditLog).insert({
      entityType: 'Product',
      entityId: product.id,
      action: 'delete',
      userId: remult.user?.id || 'system',
    })
  },
})
export class Product {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  name = ''

  @Fields.string()
  slug = ''

  @Fields.number()
  @Validators.required()
  price = 0

  @Fields.number()
  stock = 0

  @Fields.createdAt()
  createdAt = new Date()

  @Fields.updatedAt()
  updatedAt = new Date()
}
```

## Computed Fields

```typescript
import { Entity, Fields } from 'remult'

@Entity('orders')
export class Order {
  @Fields.cuid()
  id = ''

  @Fields.json<Order, OrderItem[]>()
  items: OrderItem[] = []

  @Fields.number()
  shippingCost = 0

  @Fields.number()
  taxRate = 0.1 // 10%

  // Computed field - calculated on read
  @Fields.number({
    sqlExpression: () => 'items_total + shipping_cost + tax_amount',
  })
  get total(): number {
    const itemsTotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const taxAmount = itemsTotal * this.taxRate
    return itemsTotal + this.shippingCost + taxAmount
  }

  @Fields.number()
  get itemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }
}

interface OrderItem {
  productId: string
  price: number
  quantity: number
}
```

## Enum Fields

```typescript
import { Entity, Fields } from 'remult'

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.string<Task, TaskPriority>({
    validate: (task) => {
      const validPriorities = Object.values(TaskPriority)
      if (!validPriorities.includes(task.priority as TaskPriority)) {
        throw new Error('Invalid priority')
      }
    },
  })
  priority: TaskPriority = TaskPriority.MEDIUM

  @Fields.string<Task, TaskStatus>()
  status: TaskStatus = TaskStatus.TODO

  // Helper methods
  isHighPriority(): boolean {
    return this.priority === TaskPriority.HIGH || this.priority === TaskPriority.URGENT
  }

  canTransitionTo(newStatus: TaskStatus): boolean {
    const transitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.IN_REVIEW, TaskStatus.TODO],
      [TaskStatus.IN_REVIEW]: [TaskStatus.DONE, TaskStatus.IN_PROGRESS],
      [TaskStatus.DONE]: [],
    }

    return transitions[this.status]?.includes(newStatus) || false
  }
}
```

## Summary

These patterns demonstrate:
- Basic entity structure with validation
- Authorization at entity and field level
- Relations between entities
- Backend methods for complex operations
- Lifecycle hooks for business logic
- Computed fields
- Enum handling
- Type-safe entity design
