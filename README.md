# TS AI SDLC

A modern TypeScript fullstack project built with **Vite, React, TanStack Router, TanStack Query, Remult, and PostgreSQL**, aligned with the **Agentic SDLC AI Directives** framework.

## 🚀 Tech Stack

### Frontend
- **Build Tool:** Vite (fast HMR and optimized builds)
- **UI Library:** React 18 with TypeScript
- **Routing:** TanStack Router (type-safe file-based routing)
- **State Management:** TanStack Query (server state management)
- **Dev Tools:** Router DevTools, Query DevTools

### Backend
- **Framework:** Express
- **API Layer:** Remult (Type-safe ORM and REST API)
- **Database:** PostgreSQL
- **Database Management:** pgAdmin
- **Runtime:** Node.js with TypeScript

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Language:** TypeScript (end-to-end)
- **AI Development Framework:** Agentic SDLC AI Directives

## ✨ Features

- 🚀 **Full-stack TypeScript** with end-to-end type safety
- ⚡ **Blazing fast** development with Vite HMR
- 🛣️ **Type-safe routing** with TanStack Router
- 🔄 **Powerful data fetching** with TanStack Query
- 🗄️ **Type-safe database** operations with Remult
- 🐳 **Docker Compose** setup with PostgreSQL and pgAdmin
- 📦 **Modern build system** with optimized production builds
- 🎯 **Path aliases** for clean imports
- 🤖 **AI-assisted development** with Agentic SDLC AI Directives

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **Docker** and Docker Compose (for containerized setup)
- **PostgreSQL** (if running locally without Docker)

## 📁 Project Structure

```
ts-ai-sdlc/
├── src/
│   ├── client/                  # Frontend code (Vite + React)
│   │   ├── routes/             # TanStack Router routes
│   │   │   ├── __root.tsx     # Root layout
│   │   │   ├── index.tsx      # Home page
│   │   │   ├── tasks.tsx      # Tasks page with Query
│   │   │   └── about.tsx      # About page
│   │   ├── lib/
│   │   │   └── api.ts         # API client functions
│   │   ├── main.tsx           # App entry + Query setup
│   │   ├── index.css          # Global styles
│   │   └── routeTree.gen.ts   # Generated route tree
│   ├── server/                 # Backend code (Express + Remult)
│   │   ├── api/
│   │   │   └── remult.ts      # Remult API configuration
│   │   ├── db/
│   │   │   ├── connection.ts  # PostgreSQL connection pool
│   │   │   ├── migrate.ts     # Migration runner
│   │   │   └── generate-migrations.ts
│   │   └── index.ts           # Express server entry
│   └── shared/                 # Shared code
│       └── entities/           # Remult entities (shared types)
│           └── Task.ts         # Example entity
├── context_modules/            # Agentic SDLC AI Directives
│   ├── constitution.md         # Foundational AI principles
│   ├── examples/              # Code examples and patterns
│   ├── personas/              # AI personas for specialized tasks
│   ├── principles/            # Engineering principles
│   └── rules/                 # Style guides and security rules
├── templates/                  # Development templates
│   ├── feature_development.md
│   ├── bug_fix.md
│   ├── code_review.md
│   └── technical_spike.md
├── .mcp.json                   # MCP server configuration
├── docker-compose.yml          # Docker services
├── Dockerfile                  # Application container
├── vite.config.ts             # Vite configuration
├── tsr.config.json            # TanStack Router config
├── tsconfig.json              # TypeScript configuration
├── index.html                 # HTML entry point
└── package.json               # Dependencies and scripts
```

## 🤖 Agentic SDLC AI Directives Integration

This project is configured to work with the **Agentic SDLC AI Directives** framework, which provides:

- **Constitution**: Foundational principles governing all AI-assisted development
- **Personas**: Pre-defined AI personalities for specialized tasks (TypeScript developer, frontend specialist, etc.)
- **Principles**: High-level engineering principles (type safety, security, stateless services)
- **Rules**: Explicit guidelines for style, security, and architectural patterns
- **Examples**: High-quality code examples serving as "gold standards"

The `context_modules/` directory contains the local copy of team AI directives that guide AI agents during development. The `.mcp.json` file configures the MCP server to access these directives.

### Using AI Directives

When working with AI assistants (like Claude Code or Cursor), the directives in `context_modules/` are automatically referenced to ensure:
- Type safety is maintained throughout the stack
- Security best practices are followed
- Code follows established patterns
- Development aligns with team standards

See `context_modules/constitution.md` for the foundational principles that govern all development work.

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Database

```bash
docker compose up -d postgres
```

### Step 3: Run Migrations

```bash
npm run db:migrate
```

### Step 4: Start Development Servers

```bash
npm run dev
```

This starts:
- **Backend** on http://localhost:3000 (Express + Remult)
- **Frontend** on http://localhost:5173 (Vite + React)

### Step 5: Access Your Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api
- **Admin UI**: http://localhost:3000/api/admin (dev only)
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 📜 Available Scripts

### Development
```bash
npm run dev              # Start both frontend and backend
npm run dev:server      # Start backend only
npm run dev:client      # Start frontend only
```

### Build
```bash
npm run build           # Build both frontend and backend
npm run build:server    # Build backend only
npm run build:client    # Build frontend only
```

### Database
```bash
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate migration file
```

### Code Quality
```bash
npm run typecheck       # Check TypeScript types
npm run lint            # Lint code with ESLint
npm run format          # Format code with Prettier
```

## 🗄️ Working with Remult

### Creating a New Entity

1. **Create entity file** in `src/shared/entities/`:

```typescript
import { Entity, Fields } from 'remult'

@Entity('products', {
  allowApiCrud: true,
})
export class Product {
  @Fields.cuid()
  id = ''

  @Fields.string()
  name = ''

  @Fields.number()
  price = 0

  @Fields.createdAt()
  createdAt = new Date()
}
```

2. **Register the entity** in `src/server/api/remult.ts`:

```typescript
import { Product } from '../../shared/entities/Product'

export const api = remultExpress({
  dataProvider: new SqlDatabase(new PostgresDataProvider(pool)),
  entities: [Task, Product],
  admin: process.env.NODE_ENV !== 'production',
})
```

3. **API endpoints are automatically available**:
   - `GET /api/products`
   - `POST /api/products`
   - `PUT /api/products/:id`
   - `DELETE /api/products/:id`

### Using in React Components with TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

function ProductList() {
  const queryClient = useQueryClient()

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.products.getAll,
  })

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: api.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## 🛣️ Adding New Routes

TanStack Router uses file-based routing. Create a new file in `src/client/routes/`:

```typescript
// src/client/routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const Route = createFileRoute('/products')({
  component: ProductsComponent,
})

function ProductsComponent() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: api.products.getAll,
  })

  return <div>{/* Your component code */}</div>
}
```

The route will be automatically available at `/products`.

## 🌐 Environment Variables

Create a `.env` file (see `.env.example`):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ts_ai_sdlc
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3000
NODE_ENV=development

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
# Start all services (database, pgAdmin, and app in dev mode)
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down
```

This starts:
- **PostgreSQL database** on port 5432
- **pgAdmin interface** on port 5050
- **Application** in development mode (hot reload enabled)
  - Backend API on port 3000
  - Frontend dev server on port 5173

### Production Build

```bash
# Build the production image
docker build -t ts-ai-sdlc:latest .

# Run production container
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=ts_ai_sdlc \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e NODE_ENV=production \
  ts-ai-sdlc:latest
```

In production mode:
- Express server serves both the API and the Vite-built static frontend on port 3000
- Frontend is built into `dist/client` and served as static files
- Backend runs from compiled `dist/server/index.js`

## 🔧 Path Aliases

TypeScript path aliases for cleaner imports:

- `@/*` - Root src directory
- `@server/*` - Server directory
- `@client/*` - Client directory
- `@shared/*` - Shared directory

Example:
```typescript
import { Task } from '@shared/entities/Task'
import { api } from '@client/lib/api'
```

## 🐛 Troubleshooting

### Port Already in Use

Ports in use? Change them:
- **Backend**: Edit `.env` → `PORT=3001`
- **Frontend**: Edit `vite.config.ts` → `server.port`

### Database Connection Issues

```bash
# Check database status
docker compose ps postgres

# View logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

### Route Tree Not Generated

```bash
npx tsr generate
```

The Vite plugin should auto-generate this on dev server start.

## 🤝 Contributing

This project follows TypeScript best practices:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Strict TypeScript** configuration
- **Type-safe** database operations

Before committing:
```bash
npm run typecheck
npm run lint
npm run format
```

## 📚 Documentation

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Remult](https://remult.dev)
- [Vite](https://vitejs.dev)
- [React](https://react.dev)

## 📄 License

MIT

---

**Built with ❤️ using modern TypeScript tools**
