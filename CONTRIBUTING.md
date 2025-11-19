# Contributing to TS AI SDLC

Thank you for contributing to this TypeScript fullstack project! This guide will help you understand our development workflow and standards.

## Development Philosophy

This project is built with type safety, maintainability, and developer experience as top priorities. We use:
- **TypeScript** for end-to-end type safety
- **TanStack Start** for modern React routing and SSR
- **Remult** for type-safe API and database operations
- **PostgreSQL** for reliable data persistence
- **Docker** for consistent development environments

## Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ts-ai-sdlc.git
   cd ts-ai-sdlc
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Environment**
   ```bash
   docker-compose up -d postgres pgadmin
   npm run dev
   ```

4. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Code Standards

### TypeScript

- Use strict TypeScript settings (already configured)
- Avoid `any` types - use proper typing or `unknown` with type guards
- Leverage path aliases (`@server/*`, `@client/*`, `@shared/*`)
- Enable all decorators for Remult entities

### React Components

- Use functional components with hooks
- Keep components focused and single-responsibility
- Co-locate related files (component, styles, tests)
- Use TypeScript interfaces for props

Example:
```typescript
interface TaskListProps {
  filter?: string
}

export function TaskList({ filter }: TaskListProps) {
  // component logic
}
```

### Remult Entities

- Use decorators for field definitions
- Enable appropriate CRUD permissions
- Add validation rules
- Include timestamps (`@Fields.createdAt()`, `@Fields.updatedAt()`)

Example:
```typescript
@Entity('users', {
  allowApiCrud: true,
})
export class User {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  name = ''

  @Fields.createdAt()
  createdAt = new Date()
}
```

### API Routes

- Keep business logic in Remult entities and backend methods
- Use proper HTTP status codes
- Handle errors gracefully
- Add proper TypeScript types for request/response

### Database

- Use Remult's migration system
- Never commit sensitive credentials
- Write reversible migrations when possible
- Test migrations locally before committing

## Testing

- Write tests for business logic
- Test API endpoints
- Use meaningful test descriptions
- Aim for high code coverage on critical paths

```typescript
describe('Task entity', () => {
  it('should create a task with required fields', async () => {
    // test implementation
  })
})
```

## Before Submitting

1. **Type Check**
   ```bash
   npm run typecheck
   ```

2. **Lint**
   ```bash
   npm run lint
   ```

3. **Format**
   ```bash
   npm run format
   ```

4. **Test Build**
   ```bash
   npm run build
   ```

## Pull Request Process

1. **Create PR** with a clear title and description
   - What changes were made?
   - Why were these changes necessary?
   - How should reviewers test this?

2. **PR Checklist**
   - [ ] Code follows TypeScript best practices
   - [ ] All type checks pass
   - [ ] ESLint shows no errors
   - [ ] Code is formatted with Prettier
   - [ ] New features include documentation
   - [ ] Database changes include migrations
   - [ ] Environment variables are documented in `.env.example`
   - [ ] No console.logs or debug code left behind
   - [ ] No sensitive data or credentials committed

3. **Review Process**
   - At least one team member must approve
   - Address all review comments
   - Keep discussions constructive and professional

4. **Merge**
   - Use "Squash and Merge" for feature branches
   - Use "Rebase and Merge" for hotfixes
   - Delete branch after merge

## Project Structure Conventions

```
src/
├── client/              # Frontend code
│   ├── routes/          # TanStack Router routes
│   ├── components/      # Reusable React components
│   └── hooks/           # Custom React hooks
├── server/              # Backend code
│   ├── api/             # API endpoints and Remult config
│   ├── db/              # Database connection and migrations
│   └── services/        # Business logic services
└── shared/              # Shared code between client and server
    ├── entities/        # Remult entities
    ├── types/           # Shared TypeScript types
    └── utils/           # Shared utilities
```

## Common Patterns

### Adding a New Entity

1. Create entity in `src/shared/entities/`
2. Register in `src/server/api/remult.ts`
3. Create migration if needed
4. Add to API documentation

### Adding a New Route

1. Create route file in `src/client/routes/`
2. TanStack Router will auto-detect it
3. Update `routeTree.gen.ts` if needed
4. Add navigation links if applicable

### Adding Environment Variables

1. Add to `.env.example` with description
2. Add to `docker-compose.yml` if needed for containers
3. Document in README.md
4. Use TypeScript to access: `process.env.YOUR_VAR`

## Security Guidelines

- Never commit `.env` files
- Use environment variables for all secrets
- Sanitize user input
- Use parameterized queries (Remult handles this)
- Enable CORS only for trusted origins
- Keep dependencies updated
- Follow OWASP security best practices

## Getting Help

- Check existing issues and documentation
- Ask in team chat
- Review similar implementations in the codebase
- Consult the README.md for setup issues

## Code of Conduct

- Be respectful and professional
- Welcome newcomers and help them learn
- Provide constructive feedback
- Keep discussions focused on the technical merits
- Assume good intentions

Thank you for contributing to making this project better!
