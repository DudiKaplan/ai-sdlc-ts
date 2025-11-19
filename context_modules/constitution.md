# TypeScript Fullstack Development Constitution

## Core Principles

These foundational principles govern all development work on this TypeScript fullstack project. They are non-negotiable and must be followed by all contributors, whether human or AI-assisted.

### 1. Type Safety First

**TypeScript is our contract, not a suggestion.**

- Use strict TypeScript settings - no `any` types without justification
- Leverage the type system for compile-time safety
- Share types between client and server via `@shared/*`
- Let TypeScript catch bugs before runtime
- Use Remult's type inference for end-to-end type safety

**Example:**
```typescript
// Good
interface CreateTaskRequest {
  title: string
  description?: string
}

// Bad
function createTask(data: any) { ... }
```

### 2. Human Oversight Is Mandatory

**Every contribution must receive human review before merge.**

- Agents and AI assistants operate within guardrails
- Engineers are accountable for final outcomes
- Code reviews must verify type safety, security, and best practices
- No direct commits to main branch
- All changes go through Pull Request process

### 3. Build for Observability and Reproducibility

**We must be able to trace and debug issues quickly.**

- Include proper logging at appropriate levels
- Use structured logging for easier parsing
- Add error boundaries in React components
- Track API performance and database query times
- Make workflows deterministic and testable
- Use Docker for reproducible environments

**Example:**
```typescript
// Good
console.error('Failed to create task', { error, taskData, userId })

// Bad
console.log('error')
```

### 4. Security by Default

**Security is not optional - it's built in from the start.**

- Never commit secrets, API keys, or credentials
- Use environment variables for all sensitive data
- Validate and sanitize all user inputs
- Use Remult's built-in authorization system
- Follow principle of least privilege
- Enable CORS only for trusted origins
- Keep dependencies updated and scan for vulnerabilities
- Use parameterized queries (Remult handles this)

**Example:**
```typescript
// Good
@Entity('users', {
  allowApiCrud: Allow.authenticated,
})

// Bad
@Entity('users', {
  allowApiCrud: true, // Anyone can modify!
})
```

### 5. Tests Drive Confidence

**Write automated tests before or alongside new logic.**

- Test business logic thoroughly
- Test API endpoints and error cases
- Test React components behavior
- Refuse to ship when critical coverage is missing
- Use TypeScript in tests for additional safety
- Mock external dependencies appropriately

**Example:**
```typescript
describe('Task entity', () => {
  it('should not allow empty title', async () => {
    const task = new Task()
    await expect(remult.repo(Task).save(task)).rejects.toThrow()
  })
})
```

### 6. Documentation Matters

**Clear documentation enables fast, safe development.**

- Document complex business logic
- Capture API contracts and assumptions
- Update README for setup changes
- Document environment variables in `.env.example`
- Add JSDoc comments for public APIs
- Keep inline comments focused on "why" not "what"
- Maintain up-to-date architecture decisions

**Example:**
```typescript
/**
 * Assigns a task to a user and sends notification.
 *
 * @throws {UnauthorizedError} if user lacks permission
 * @throws {TaskNotFoundError} if task doesn't exist
 */
@BackendMethod({ allowed: Allow.authenticated })
static async assignTask(taskId: string, userId: string) { ... }
```

### 7. React Best Practices

**Build maintainable, performant React applications.**

- Use functional components with hooks
- Keep components focused and single-responsibility
- Avoid prop drilling - use context when appropriate
- Memoize expensive computations
- Handle loading and error states
- Use TanStack Router for type-safe navigation
- Follow accessibility best practices

### 8. Database Integrity

**Data is our most valuable asset - protect it.**

- Use Remult migrations for schema changes
- Write reversible migrations when possible
- Test migrations on development databases first
- Use transactions for multi-step operations
- Add appropriate indexes for performance
- Use foreign keys for referential integrity
- Never expose database credentials

### 9. API Design Excellence

**APIs should be intuitive, consistent, and type-safe.**

- Let Remult generate CRUD endpoints automatically
- Use backend methods for complex operations
- Return meaningful error messages
- Use appropriate HTTP status codes
- Version APIs when making breaking changes
- Document expected request/response formats
- Handle edge cases and validation

### 10. Performance Matters

**Build for scale from the start.**

- Lazy load routes and components
- Optimize database queries
- Use appropriate caching strategies
- Monitor and profile performance
- Avoid N+1 query problems
- Use pagination for large datasets
- Compress assets and responses

---

## Enforcement

These principles are enforced through:

1. **TypeScript Compiler** - Catches type errors at compile time
2. **ESLint** - Enforces code style and best practices
3. **Code Reviews** - Human verification of adherence
4. **CI/CD Pipeline** - Automated checks before deployment
5. **Testing** - Verification of functionality and safety

## Living Document

This constitution evolves with our team's needs. Propose changes via Pull Request with clear rationale and team consensus.
