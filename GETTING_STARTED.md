# 🚀 Getting Started with TS AI SDLC

A modern fullstack TypeScript application with Vite, React, TanStack, Remult, and PostgreSQL.

## 🏗️ Architecture

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **TypeScript** - Type safety

### Backend
- **Express** - Web framework
- **Remult** - Type-safe ORM and API
- **PostgreSQL** - Database
- **TypeScript** - Type safety

## 📦 Prerequisites

- Node.js >= 18
- PostgreSQL (via Docker or local install)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
docker compose up -d postgres
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

### 4. Start Development Servers

```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:3002
- **Frontend** on http://localhost:5173

## 📍 Available URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React app |
| Backend API | http://localhost:3002/api | REST API |
| Health Check | http://localhost:3002/api/health | Server status |
| Admin UI | http://localhost:3002/api/admin | Database admin (dev only) |

## 🎯 Features

### ✅ Tasks Management
- Create, read, update, and delete tasks
- Mark tasks as completed
- View task list with real-time updates

### 🔄 TanStack Query Integration
- Automatic caching and revalidation
- Optimistic updates
- Loading and error states
- DevTools for debugging

### 🛣️ TanStack Router
- File-based routing
- Type-safe navigation
- Code splitting
- Route-level data loading

## 📁 Project Structure

```
ts-ai-sdlc/
├── src/
│   ├── client/                 # Frontend code
│   │   ├── routes/            # TanStack Router routes
│   │   │   ├── __root.tsx    # Root layout
│   │   │   ├── index.tsx     # Home page
│   │   │   ├── tasks.tsx     # Tasks page
│   │   │   └── about.tsx     # About page
│   │   ├── lib/
│   │   │   └── api.ts        # API client
│   │   ├── main.tsx          # App entry point
│   │   └── index.css         # Global styles
│   ├── server/                # Backend code
│   │   ├── index.ts          # Express server
│   │   ├── api/
│   │   │   └── remult.ts     # Remult config
│   │   └── db/
│   │       ├── connection.ts # Database connection
│   │       └── migrate.ts    # Migration script
│   └── shared/               # Shared code
│       └── entities/
│           └── Task.ts       # Task entity
├── index.html                # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:server      # Start backend only
npm run dev:client      # Start frontend only

# Build
npm run build           # Build both frontend and backend
npm run build:server    # Build backend only
npm run build:client    # Build frontend only

# Database
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate migration file

# Code Quality
npm run typecheck       # Check TypeScript types
npm run lint            # Lint code
npm run format          # Format code with Prettier
```

## 🧪 Testing the API

### Create a Task
```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description"}'
```

### Get All Tasks
```bash
curl http://localhost:3002/api/tasks
```

### Update a Task
```bash
curl -X PUT http://localhost:3002/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3002/api/tasks/{id}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (already exists):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ts_ai_sdlc
DB_USER=postgres
DB_PASSWORD=postgres

# Server
PORT=3002
NODE_ENV=development
```

### Vite Proxy

The frontend proxies API requests to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true,
    },
  },
}
```

## 📚 Key Libraries

### Frontend
- `react` - UI library
- `@tanstack/react-router` - Routing
- `@tanstack/react-query` - Server state
- `vite` - Build tool

### Backend
- `express` - Web framework
- `remult` - ORM and API
- `pg` - PostgreSQL client
- `tsx` - TypeScript execution

## 🐛 Troubleshooting

### Port Already in Use

If ports 3002 or 5173 are in use:

```bash
# Find and kill processes
lsof -i :3002
lsof -i :5173
kill -9 <PID>
```

Or change ports in:
- Backend: `.env` (`PORT=3002`)
- Frontend: `vite.config.ts` (`server.port`)

### Database Connection Issues

```bash
# Restart database
docker compose restart postgres

# Check logs
docker compose logs postgres

# Verify connection
psql -U postgres -d ts_ai_sdlc -h localhost
```

### Route Tree Not Generated

The route tree is auto-generated by TanStack Router. If you see errors:

```bash
npx tsr generate
```

## 🎉 Next Steps

1. **Add Authentication** - Integrate auth providers
2. **Add More Entities** - Create users, projects, etc.
3. **Add Tests** - Unit and integration tests
4. **Deploy** - Deploy to Vercel, Railway, or your platform
5. **Add UI Library** - shadcn/ui, Material-UI, etc.

## 📖 Documentation

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Remult](https://remult.dev)
- [Vite](https://vitejs.dev)
- [React](https://react.dev)

---

**Happy Coding! 🚀**
