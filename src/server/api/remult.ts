import { remultExpress } from 'remult/remult-express'
import { SqlDatabase } from 'remult'
import { PostgresDataProvider } from 'remult/postgres'
import { pool } from '../db/connection'

// Import entities here
import { Task } from '../../shared/entities/Task'

export const api = remultExpress({
  dataProvider: new SqlDatabase(new PostgresDataProvider(pool)),
  entities: [Task],
  admin: process.env.NODE_ENV !== 'production', // Enable admin UI only in development
})
