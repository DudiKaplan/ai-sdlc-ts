import express from 'express'
import { api } from './api/remult'
import { testConnection } from './db/connection'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Health check endpoint (before Remult to avoid conflicts)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Simple hello endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from TS AI SDLC!' })
})

// Remult API (handles /api/tasks, /api/admin, etc.)
app.use(api)

// Serve static files from Vite build in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client')
  app.use(express.static(clientDistPath))

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection()

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`)
      console.log(`📊 Remult API available at http://localhost:${port}/api`)
      console.log(`🔧 Remult Admin UI at http://localhost:${port}/api/admin`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
