import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return (
    <div>
      <h1>About</h1>
      <p>
        This is a modern fullstack TypeScript application demonstrating
        best practices for building scalable web applications.
      </p>
      <h2>Tech Stack</h2>
      <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
        <li><strong>Frontend:</strong> React + Vite</li>
        <li><strong>State Management:</strong> TanStack Query</li>
        <li><strong>Routing:</strong> TanStack Router</li>
        <li><strong>Backend:</strong> Express + Node.js</li>
        <li><strong>ORM:</strong> Remult</li>
        <li><strong>Database:</strong> PostgreSQL</li>
        <li><strong>Language:</strong> TypeScript</li>
      </ul>
    </div>
  )
}
