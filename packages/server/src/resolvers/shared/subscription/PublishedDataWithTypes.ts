import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { MutationType } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'

registerEnumType(Topics, {
  name: 'PublishedDataType',
})

@ObjectType()
export class PublishedDataWithTypes {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field((_type) => Topics)
  type: Topics

  @Field()
  id: string
}
