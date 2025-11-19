# 🚀 How to Run ts-ai-sdlc

## Prerequisites

- **Node.js** v18+ (you have v22.16.0 ✅)
- **npm** v9+ (you have v10.9.2 ✅)
- **Docker & Docker Compose** (for database)

---

## Option 1: Run with Docker (Everything Containerized)

### 1. Start all services (Database + App)

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **pgAdmin** on port 5050 (http://localhost:5050)
- **Your App** on port 3000 (http://localhost:3000)

### 2. Check logs

```bash
docker compose logs -f app
```

### 3. Stop services

```bash
docker compose down
```

---

## Option 2: Run Locally (Development Mode)

### 1. Start only the database

```bash
docker compose up -d postgres
```

Wait for PostgreSQL to be healthy (about 10 seconds):

```bash
docker compose ps
```

You should see `(healthy)` status.

### 2. Run database migrations

```bash
npm run db:migrate
```

Expected output:
```
🔄 Starting database migration...
📊 Creating/updating tables...
✅ Migration completed successfully!

Tables created/updated:
  - tasks
```

### 3. Start the development server

```bash
npm run dev
```

Expected output:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🎯 Access Your Application

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Web App** | http://localhost:3000 | Your TanStack Start application |
| **Remult API** | http://localhost:3000/api | RESTful CRUD API |
| **Admin UI** | http://localhost:3000/api/admin | Database admin (dev only) |
| **pgAdmin** | http://localhost:5050 | PostgreSQL admin tool |

### pgAdmin Login (if using Docker)
- **Email**: admin@admin.com
- **Password**: admin

---

## 🧪 Test Your API

### Create a task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Testing the API"}'
```

### Get all tasks
```bash
curl http://localhost:3000/api/tasks
```

### Get single task
```bash
curl http://localhost:3000/api/tasks/{task-id}
```

### Update a task
```bash
curl -X PUT http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

---

## 📝 Other Useful Commands

### Type checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Generate database migration
```bash
npm run db:generate
```

### View database logs
```bash
docker compose logs -f postgres
```

### Stop database only
```bash
docker compose stop postgres
```

### Reset database (⚠️ deletes all data)
```bash
docker compose down -v
docker compose up -d postgres
npm run db:migrate
```

---

## 🐛 Troubleshooting

### Port already in use

If port 3000 or 5432 is already in use:

**Option 1**: Stop the conflicting service
```bash
# Find what's using the port
lsof -i :3000
lsof -i :5432

# Kill the process (replace PID)
kill -9 <PID>
```

**Option 2**: Change the port in `.env`
```env
PORT=3001  # or any available port
```

### Database connection failed

1. Check if PostgreSQL is running:
```bash
docker compose ps postgres
```

2. Check database logs:
```bash
docker compose logs postgres
```

3. Restart PostgreSQL:
```bash
docker compose restart postgres
```

### TypeScript errors

```bash
npm run typecheck
```

If errors persist, check the error messages and fix the code.

### Clear cache and rebuild

```bash
rm -rf .vinxi dist node_modules/.vite
npm run dev
```

---

## 🔄 Development Workflow

1. **Start database**: `docker compose up -d postgres`
2. **Run migrations**: `npm run db:migrate` (first time only)
3. **Start dev server**: `npm run dev`
4. **Make changes**: Edit files in `src/`
5. **Test**: Open http://localhost:3000
6. **Stop**: `Ctrl+C` to stop dev server

---

## 🎉 You're Ready!

Your application is now running with:
- ✅ TanStack Start for full-stack React
- ✅ Remult for type-safe APIs
- ✅ PostgreSQL for data storage
- ✅ Hot reload for rapid development

Happy coding! 🚀
