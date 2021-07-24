import { registerEnumType } from 'type-graphql'

enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

const CREATED = 'CREATED'
const UPDATED = 'UPDATED'
const DELETED = 'DELETED'

registerEnumType(MutationType, {
  name: 'MutationType',
})

export { MutationType, CREATED, UPDATED, DELETED }
