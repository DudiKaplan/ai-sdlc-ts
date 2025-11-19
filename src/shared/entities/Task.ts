import { Entity, Fields } from 'remult'

@Entity('tasks', {
  allowApiCrud: true,
})
export class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.string({ allowNull: true })
  description?: string

  @Fields.boolean()
  completed = false

  @Fields.createdAt()
  createdAt = new Date()

  @Fields.updatedAt()
  updatedAt = new Date()
}
