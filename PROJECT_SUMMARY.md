# Project Summary - TS AI SDLC

> **AI-Optimized Documentation**: This file provides a concise, structured overview of the project for AI assistants and developers.

## 🎯 Project Overview

**Name**: TS AI SDLC
**Type**: Fullstack TypeScript Web Application
**Purpose**: Modern task management application demonstrating best practices for AI-assisted development
**Framework Approach**: Agentic SDLC AI Directives

## 🏗️ Current Architecture (2025)

### Frontend Stack
```
Vite → React 18 → TanStack Router + TanStack Query → TypeScript
```

- **Build Tool**: Vite 6 (HMR, optimized builds)
- **UI Framework**: React 18 with TypeScript
- **Routing**: TanStack Router (file-based, type-safe)
- **State Management**: TanStack Query (server state)
- **Dev Tools**: Router DevTools, Query DevTools included

### Backend Stack
```
Express → Remult → PostgreSQL → TypeScript
```

- **Server**: Express 4
- **API Layer**: Remult (type-safe ORM + REST API generation)
- **Database**: PostgreSQL 16
- **Type Safety**: End-to-end TypeScript

### Key Technologies
- **Language**: TypeScript 5.7 (strict mode)
- **Package Manager**: npm
- **Runtime**: Node.js 22+
- **Containerization**: Docker Compose

## 📁 File Structure

### Critical Paths (AI Reference)

```
src/
├── client/                          # Frontend (Vite + React)
│   ├── routes/                     # TanStack Router routes (file-based)
│   │   ├── __root.tsx             # Root layout with navigation
│   │   ├── index.tsx              # Home page (/)
│   │   ├── tasks.tsx              # Tasks CRUD (/tasks) with TanStack Query
│   │   └── about.tsx              # About page (/about)
│   ├── lib/api.ts                 # API client functions (fetch wrappers)
│   ├── main.tsx                   # App entry + QueryClient setup
│   ├── index.css                  # Global styles
│   └── routeTree.gen.ts           # Auto-generated route tree (DO NOT EDIT)
├── server/                         # Backend (Express + Remult)
│   ├── index.ts                   # Express server entry point
│   ├── api/remult.ts              # Remult configuration + entity registration
│   └── db/
│       ├── connection.ts          # PostgreSQL connection pool
│       ├── migrate.ts             # Migration runner script
│       └── generate-migrations.ts # Migration generator script
└── shared/                         # Shared between client and server
    └── entities/                   # Remult entities (database models)
        └── Task.ts                 # Example entity with CRUD

context_modules/                    # AI Directives (DO NOT MODIFY)
├── constitution.md                 # Core AI development principles
├── personas/v1/                    # AI role definitions
├── principles/v1/                  # Engineering principles
├── rules/v1/                       # Style guides & security rules
└── examples/v1/                    # Code examples

templates/                          # Development workflow templates
├── feature_development.md
├── bug_fix.md
├── code_review.md
└── technical_spike.md

Configuration Files:
├── vite.config.ts                 # Vite config (proxy: /api → :3000)
├── tsr.config.json                # TanStack Router config
├── tsconfig.json                  # TypeScript config (strict, decorators)
├── package.json                   # Dependencies & scripts
├── index.html                     # HTML entry point
├── docker-compose.yml             # Services (postgres, pgadmin, app)
├── Dockerfile                     # App container definition
└── .env                           # Environment variables
```

## 🔧 Key Commands

### Development
```bash
npm run dev              # Start both servers (backend:3000, frontend:5173)
npm run dev:server      # Backend only
npm run dev:client      # Frontend only
```

### Database
```bash
npm run db:migrate      # Run migrations
npm run db:generate     # Generate migration file
```

### Code Quality
```bash
npm run typecheck       # TypeScript checks
npm run lint            # ESLint
npm run format          # Prettier
```

## 🔌 API Patterns

### Remult Auto-Generated Endpoints

For each entity (e.g., `Task`):
```
GET    /api/tasks          # List all
GET    /api/tasks/:id      # Get one
POST   /api/tasks          # Create
PUT    /api/tasks/:id      # Update
DELETE /api/tasks/:id      # Delete
```

Admin UI (dev only): `/api/admin`

### Frontend Data Fetching (TanStack Query)

```typescript
// Query pattern
const { data, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: api.tasks.getAll,
})

// Mutation pattern
const mutation = useMutation({
  mutationFn: api.tasks.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  },
})
```

## 🗄️ Database Schema

Current entities:
- **Task** (`tasks` table)
  - `id`: string (cuid)
  - `title`: string
  - `description`: string (nullable)
  - `completed`: boolean
  - `createdAt`: timestamp
  - `updatedAt`: timestamp (auto-updated)

## 🚀 Adding Features

### 1. New Entity
1. Create `/src/shared/entities/MyEntity.ts`
2. Register in `/src/server/api/remult.ts` → `entities` array
3. Run `npm run db:migrate`
4. API auto-generated at `/api/my_entity`

### 2. New Route
1. Create `/src/client/routes/my-route.tsx`
2. Export route with `createFileRoute('/my-route')({...})`
3. Route automatically available at `/my-route`

### 3. API Client Function
Add to `/src/client/lib/api.ts`:
```typescript
export const api = {
  myEntity: {
    getAll: async () => { /* ... */ },
    create: async (data) => { /* ... */ },
  }
}
```

## 🧪 Testing Patterns

### Manual API Testing
```bash
curl http://localhost:3000/api/tasks
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task"}'
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Admin UI: http://localhost:3000/api/admin
- pgAdmin: http://localhost:5050

## 🐳 Docker Configuration

### Development Mode
```bash
docker compose up -d
```
- Runs both frontend (port 5173) and backend (port 3000) with hot reload
- Mounts source code as volumes for live development
- PostgreSQL and pgAdmin services included

### Production Mode
```bash
docker build -t ts-ai-sdlc:latest .
docker run -p 3000:3000 ts-ai-sdlc:latest
```
- Multi-stage build optimizes image size
- Vite builds frontend to `dist/client`
- TypeScript compiles backend to `dist/server`
- Express serves both API and static frontend on port 3000
- Only production dependencies included

## 🔐 Security Implementation

- SQL injection: Protected by Remult's parameterized queries
- Input validation: Remult decorators + TypeScript types
- Admin UI: Disabled in production (`NODE_ENV` check)
- Environment variables: `.env` file (not committed)
- CORS: Configured in Express if needed

## 📊 Performance Considerations

- **TanStack Query**: Automatic caching, deduplication
- **Vite**: Fast HMR, optimized production builds
- **PostgreSQL**: Connection pooling (max: 20)
- **React**: Code splitting via TanStack Router
- **Docker**: Multi-stage builds for smaller production images

## 🤖 AI Development Context

### AI Directives Location
`context_modules/` contains structured guidance for AI assistants:

- **Constitution**: Core principles all AI work must follow
- **Personas**: Role-specific behaviors (TypeScript dev, frontend specialist)
- **Principles**: High-level engineering guidelines
- **Rules**: Specific style and security requirements
- **Examples**: Reference implementations

### When AI Assists
1. Read `context_modules/constitution.md` for core principles
2. Reference relevant persona in `personas/v1/`
3. Follow principles from `principles/v1/`
4. Apply rules from `rules/v1/`
5. Use examples from `examples/v1/` as templates

## 🔄 Development Workflow

1. **Feature Request** → Use `templates/feature_development.md`
2. **Bug Report** → Use `templates/bug_fix.md`
3. **Code Review** → Use `templates/code_review.md`
4. **Investigation** → Use `templates/technical_spike.md`

## ⚠️ Important Notes for AI

1. **DO NOT** modify files in `context_modules/` - these are reference materials
2. **DO NOT** edit `src/client/routeTree.gen.ts` - auto-generated
3. **ALWAYS** run `npm run typecheck` before committing
4. **ALWAYS** use TypeScript strict mode
5. **ALWAYS** use Remult for database operations (never raw SQL)
6. **PREFER** TanStack Query for server state (not useState)

## 📝 Recent Changes

- ✅ Replaced TanStack Start with Vite + React
- ✅ Added TanStack Router for file-based routing
- ✅ Added TanStack Query for server state management
- ✅ Configured Express backend with Remult
- ✅ Set up PostgreSQL with migrations
- ✅ Integrated DevTools for Router and Query

## 🎯 Current Status

- **Backend**: ✅ Fully functional (Express + Remult + PostgreSQL)
- **Frontend**: ✅ Fully functional (Vite + React + TanStack)
- **Database**: ✅ Configured with migrations
- **TypeScript**: ✅ Zero errors, strict mode
- **Development**: ✅ Hot reload working
- **Production**: ⚠️ Ready (needs deployment configuration)

---

**Last Updated**: 2025-11-19
**Version**: 1.0.0
**AI Framework**: Agentic SDLC AI Directives
