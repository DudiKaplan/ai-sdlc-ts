# Server Architecture

## Overview

This project uses **TanStack Start** as the full-stack framework, which handles both client-side routing and server-side rendering through Vinxi.

## Architecture Changes (November 2025)

### Previous Architecture (Removed)
- Standalone Express server in `index.ts`
- Conflicted with TanStack Start's built-in server

### Current Architecture
- **TanStack Start** handles all server functionality via `entry-server.tsx`
- **Remult API** integrated through Express middleware
- **Vinxi** manages the build and development server

## Directory Structure

```
src/server/
├── entry-server.tsx        # TanStack Start server entry point
├── api/
│   └── remult.ts          # Remult API configuration
├── db/
│   ├── connection.ts      # PostgreSQL connection pool
│   ├── migrate.ts         # Database migration runner
│   └── generate-migrations.ts  # Migration generator
└── index.ts.backup.*      # Backups of old Express server
```

## Running the Application

### Development
```bash
npm run dev
```
This starts Vinxi in development mode with hot reload.

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Remult API
- **Base URL**: `/api`
- **Admin UI**: `/api/admin` (development only)
- Automatically generated CRUD endpoints for all entities

### Custom API Routes
To add custom API routes in TanStack Start, create route files in `src/client/routes/` with server handlers.

Example:
```typescript
// src/client/routes/api/health.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ status: 'ok' })
      }
    }
  }
})
```

## Database

### Connection
PostgreSQL connection is configured in `src/server/db/connection.ts` using environment variables from `.env`.

### Migrations
```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate
```

## Environment Variables

Required in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ts_ai_sdlc
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
NODE_ENV=development
```

## Integration with Remult

Remult is integrated as Express middleware and provides:
- Type-safe CRUD operations
- Automatic REST API generation
- Built-in validation
- Real-time updates support
- Admin UI for development

## Security Notes

1. **Admin UI** is disabled in production (see `src/server/api/remult.ts`)
2. **Database credentials** should be stored in `.env` (never commit)
3. **Input validation** is handled by Remult decorators
4. **SQL injection** protection via parameterized queries

## Troubleshooting

### TypeScript Errors
```bash
npm run typecheck
```

### Build Issues
```bash
# Clean build
rm -rf .vinxi dist node_modules/.vite
npm run build
```

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Verify `.env` credentials
3. Check database exists
4. Run: `npm run db:migrate`
