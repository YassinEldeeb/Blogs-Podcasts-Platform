import { registerEnumType } from 'type-graphql'

enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

registerEnumType(MutationType, {
  name: 'MutationType',
})

export { MutationType }
