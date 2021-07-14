import { Field, ObjectType } from 'type-graphql'
import { MutationType } from '../../../enums/mutationType'
import { Post } from '../../../models/Post'

@ObjectType()
export class PostSubscriptionPayload {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field({ nullable: true })
  data: Post
}
