import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SeenPayload {
  @Field()
  seen: boolean
}
