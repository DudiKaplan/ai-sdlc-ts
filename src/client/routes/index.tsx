import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div>
      <h1>Welcome to TS AI SDLC</h1>
      <p>A fullstack TypeScript application with:</p>
      <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
        <li>⚡ Vite + React for blazing fast development</li>
        <li>🔄 TanStack Query for server state management</li>
        <li>🛣️ TanStack Router for type-safe routing</li>
        <li>🔌 Remult for type-safe API</li>
        <li>🐘 PostgreSQL for data persistence</li>
        <li>🚀 Express backend</li>
      </ul>
      <Link to="/tasks">
        <button>Go to Tasks</button>
      </Link>
    </div>
  )
}
