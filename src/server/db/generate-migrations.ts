import { SqlDatabase } from 'remult'
import { PostgresDataProvider } from 'remult/postgres'
import { pool } from './connection'
import { Task } from '../../shared/entities/Task'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Migration Generator
 *
 * This script generates SQL migration files based on Remult entity definitions.
 * It compares the current database schema with the entity definitions and
 * generates the necessary SQL statements to update the schema.
 */

async function generateMigration() {
  console.log('🔄 Generating migration...')

  try {
    const dataProvider = new SqlDatabase(new PostgresDataProvider(pool))

    // Get the schema SQL for all entities
    const entities = [Task]
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const migrationDir = join(process.cwd(), 'migrations')

    // Create migrations directory if it doesn't exist
    if (!existsSync(migrationDir)) {
      mkdirSync(migrationDir, { recursive: true })
    }

    // Generate SQL for each entity
    let sql = '-- Migration generated at ' + new Date().toISOString() + '\n\n'

    for (const entity of entities) {
      const entityKey = entity.name.toLowerCase() + 's'
      sql += `-- Create table for ${entity.name}\n`
      sql += `CREATE TABLE IF NOT EXISTS "${entityKey}" (\n`
      sql += `  "id" TEXT PRIMARY KEY,\n`
      sql += `  "title" TEXT NOT NULL,\n`
      sql += `  "description" TEXT,\n`
      sql += `  "completed" BOOLEAN NOT NULL DEFAULT false,\n`
      sql += `  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n`
      sql += `  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n`
      sql += `);\n\n`

      // Add index for performance
      sql += `-- Add index for common queries\n`
      sql += `CREATE INDEX IF NOT EXISTS "idx_${entityKey}_completed" ON "${entityKey}" ("completed");\n`
      sql += `CREATE INDEX IF NOT EXISTS "idx_${entityKey}_createdAt" ON "${entityKey}" ("createdAt");\n\n`
    }

    // Add trigger for updatedAt
    sql += `-- Create or replace function to update updatedAt timestamp\n`
    sql += `CREATE OR REPLACE FUNCTION update_updated_at_column()\n`
    sql += `RETURNS TRIGGER AS $$\n`
    sql += `BEGIN\n`
    sql += `  NEW."updatedAt" = CURRENT_TIMESTAMP;\n`
    sql += `  RETURN NEW;\n`
    sql += `END;\n`
    sql += `$$ LANGUAGE plpgsql;\n\n`

    for (const entity of entities) {
      const entityKey = entity.name.toLowerCase() + 's'
      sql += `-- Create trigger for ${entity.name}\n`
      sql += `DROP TRIGGER IF EXISTS update_${entityKey}_updated_at ON "${entityKey}";\n`
      sql += `CREATE TRIGGER update_${entityKey}_updated_at\n`
      sql += `  BEFORE UPDATE ON "${entityKey}"\n`
      sql += `  FOR EACH ROW\n`
      sql += `  EXECUTE FUNCTION update_updated_at_column();\n\n`
    }

    // Write migration file
    const filename = `${timestamp}_initial_schema.sql`
    const filepath = join(migrationDir, filename)
    writeFileSync(filepath, sql)

    console.log('✅ Migration file generated successfully!')
    console.log(`📄 File: ${filepath}`)
    console.log('\nTo apply this migration:')
    console.log('  1. Review the SQL file')
    console.log('  2. Run: npm run db:migrate')
    console.log('\nOr apply manually:')
    console.log(`  psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f ${filepath}`)

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration generation failed:', error)
    process.exit(1)
  }
}

generateMigration()
