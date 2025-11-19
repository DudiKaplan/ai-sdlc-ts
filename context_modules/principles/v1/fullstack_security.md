# Fullstack Security Principle

## Overview

Security must be built into every layer of the application—from the database to the UI. This principle outlines how to implement defense-in-depth security in a TypeScript fullstack application using Remult, React, and PostgreSQL.

## Security Layers

### 1. Never Trust Client Input

Always validate and sanitize on the server, regardless of client-side validation.

```typescript
// Client-side validation (for UX)
function TaskForm() {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client validation for immediate feedback
    if (title.length < 3) {
      setError('Title must be at least 3 characters')
      return
    }

    await createTask({ title })
  }
}

// Server-side validation (MUST HAVE)
@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
})
export class Task {
  @Fields.string({
    validate: (task) => {
      if (task.title.length < 3) {
        throw new Error('Title must be at least 3 characters')
      }
      if (task.title.length > 200) {
        throw new Error('Title too long')
      }
    },
  })
  @Validators.required()
  title = ''
}
```

### 2. Authentication and Authorization

Use Remult's built-in authorization system:

```typescript
// Define user roles
export enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// Entity-level permissions
@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: (remult) => remult.user?.roles?.includes(Role.Admin),
})
export class Task {
  @Fields.string()
  @Allow.authenticated
  title = ''

  @Fields.string()
  @Allow((remult, task) => {
    // Users can only see their own private notes
    return remult.user?.id === task.userId
  })
  privateNotes = ''

  @Fields.string()
  userId = ''
}

// Backend methods with authorization
export class Task {
  @BackendMethod({ allowed: Allow.authenticated })
  static async assignTo(taskId: string, userId: string, remult?: Remult) {
    const task = await remult!.repo(Task).findId(taskId)
    if (!task) throw new Error('Task not found')

    // Additional authorization logic
    const currentUser = remult!.user!
    if (!currentUser.roles?.includes(Role.Admin) && task.userId !== currentUser.id) {
      throw new Error('Unauthorized')
    }

    task.userId = userId
    return await remult!.repo(Task).save(task)
  }
}
```

### 3. Environment Variables and Secrets

Never hardcode secrets—use environment variables:

```typescript
// .env (NEVER COMMIT THIS FILE)
DB_PASSWORD=super_secret_password
JWT_SECRET=another_secret

// .env.example (COMMIT THIS)
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here

// Server configuration
import { config } from 'dotenv'
config()

const dbConfig = {
  host: process.env.DB_HOST!,
  password: process.env.DB_PASSWORD!, // From environment
  // Never: password: 'hardcoded_password'
}

// Type-safe config
interface ServerConfig {
  jwtSecret: string
  dbPassword: string
}

function loadConfig(): ServerConfig {
  const { JWT_SECRET, DB_PASSWORD } = process.env

  if (!JWT_SECRET || !DB_PASSWORD) {
    throw new Error('Missing required environment variables')
  }

  return {
    jwtSecret: JWT_SECRET,
    dbPassword: DB_PASSWORD,
  }
}
```

### 4. SQL Injection Prevention

Remult uses parameterized queries automatically, but be aware:

```typescript
// Remult handles this safely
const tasks = await remult.repo(Task).find({
  where: {
    title: { $contains: userInput }, // Safe - parameterized
  },
})

// If you must use raw SQL (rare), use parameters
const result = await pool.query(
  'SELECT * FROM tasks WHERE user_id = $1',
  [userId] // Parameterized - safe
)

// NEVER do this:
// const result = await pool.query(`SELECT * FROM tasks WHERE user_id = ${userId}`) // UNSAFE!
```

### 5. XSS Prevention

React escapes content by default, but be careful with `dangerouslySetInnerHTML`:

```typescript
// Safe - React escapes automatically
function TaskTitle({ title }: { title: string }) {
  return <h2>{title}</h2> // Safe even if title contains <script>
}

// Dangerous - avoid unless absolutely necessary
function TaskDescription({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }} // Can execute scripts!
    />
  )
}

// If you must render HTML, sanitize it first
import DOMPurify from 'dompurify'

function SafeTaskDescription({ html }: { html: string }) {
  const cleanHtml = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
```

### 6. CORS Configuration

Configure CORS appropriately for your environment:

```typescript
import express from 'express'
import cors from 'cors'

const app = express()

// Development - more permissive
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
}

// Production - strict
if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
  )
}
```

### 7. Rate Limiting

Protect against brute force and DDoS attacks:

```typescript
import rateLimit from 'express-rate-limit'

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
})

app.use('/api/', limiter)

// Stricter limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts',
})

app.use('/api/auth/login', authLimiter)
```

### 8. Secure Headers

Use security headers to protect against common attacks:

```typescript
import helmet from 'helmet'

app.use(helmet())

// Configure CSP (Content Security Policy)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  })
)
```

### 9. Password Security

Never store passwords in plain text:

```typescript
import bcrypt from 'bcrypt'

@Entity('users', {
  allowApiCrud: false, // Users can't CRUD themselves via API
})
export class User {
  @Fields.cuid()
  id = ''

  @Fields.string()
  email = ''

  // Never expose password field to client
  @Fields.string({ includeInApi: false })
  passwordHash = ''

  @BackendMethod({ allowed: true })
  static async register(email: string, password: string, remult?: Remult) {
    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await remult!.repo(User).insert({
      email,
      passwordHash,
    })

    return { id: user.id, email: user.email }
  }

  @BackendMethod({ allowed: true })
  static async login(email: string, password: string, remult?: Remult) {
    const user = await remult!.repo(User).findOne({ where: { email } })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    // Return user data (never the password hash!)
    return { id: user.id, email: user.email }
  }
}
```

### 10. File Upload Security

Validate file uploads carefully:

```typescript
import multer from 'multer'
import path from 'path'

// Configure file upload limits and types
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Only allow specific file types
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      // Generate safe filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
    },
  }),
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  // Handle upload
})
```

### 11. Logging and Monitoring

Log security events for auditing:

```typescript
// Structured logging
interface SecurityLog {
  event: 'login' | 'logout' | 'failed_auth' | 'unauthorized_access'
  userId?: string
  ip: string
  timestamp: Date
  details?: string
}

function logSecurityEvent(log: SecurityLog) {
  console.log(JSON.stringify(log))
  // Also send to monitoring service
}

// Use in authentication
@BackendMethod({ allowed: true })
static async login(email: string, password: string, remult?: Remult) {
  const user = await remult!.repo(User).findOne({ where: { email } })

  if (!user) {
    logSecurityEvent({
      event: 'failed_auth',
      ip: remult!.context.request.ip,
      timestamp: new Date(),
      details: `Login attempt for non-existent user: ${email}`,
    })
    throw new Error('Invalid credentials')
  }

  // ... rest of login logic
}
```

### 12. Dependency Security

Keep dependencies updated and scan for vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically when possible
npm audit fix

# Update dependencies
npm update

# Use npm ci in CI/CD for reproducible builds
npm ci
```

## Security Checklist

Before deploying to production:

- [ ] All secrets are in environment variables
- [ ] No `.env` file in git repository
- [ ] Authentication is required for sensitive operations
- [ ] Authorization checks are in place
- [ ] Input validation is implemented server-side
- [ ] SQL injection is prevented (Remult does this)
- [ ] XSS is prevented (React does this by default)
- [ ] CORS is configured appropriately
- [ ] Rate limiting is enabled
- [ ] Security headers are set
- [ ] Passwords are hashed (never stored plain text)
- [ ] File uploads are validated
- [ ] Dependencies are up to date
- [ ] Security events are logged
- [ ] HTTPS is enforced in production

## Summary

Security is not a feature—it's a fundamental requirement. By implementing security at every layer and following these principles, we build applications that protect our users' data and our organization's reputation.
