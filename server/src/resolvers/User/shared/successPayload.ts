import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SuccessPayload {
  @Field()
  success: boolean
}
