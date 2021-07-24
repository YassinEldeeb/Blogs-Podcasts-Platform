import { Post } from '@/models/Post'
import { MutationType } from '@/types/enums/mutationType'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PostSubscriptionPayload {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field({ nullable: true })
  data: Post

  @Field({ nullable: true })
  deletedPostId?: string
}
