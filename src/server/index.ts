import express from 'express'
import { api } from './api/remult.js'
import { testConnection } from './db/connection.js'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

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

// Serve static files from Vite build (when running from dist/)
// Check if client dist directory exists (production build)
const clientDistPath = path.join(__dirname, '../client')
const clientDistExists = existsSync(clientDistPath)

if (clientDistExists) {
  app.use(express.static(clientDistPath))

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
  console.log('🌐 Frontend static files will be served from dist/client')
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
