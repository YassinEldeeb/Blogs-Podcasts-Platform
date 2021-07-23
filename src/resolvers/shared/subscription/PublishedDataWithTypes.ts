import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { MutationType } from '../../../@types/enums/mutationType'

enum types {
  comment = 'comment',
  heart = 'heart',
}

registerEnumType(types, {
  name: 'PublishedDataType',
})

@ObjectType()
export class PublishedDataWithTypes {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field((_type) => types)
  type: types

  @Field()
  id: string
}
