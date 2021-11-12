import { Field, ObjectType } from 'type-graphql'
import { MutationType } from '@Types/enums/mutationType'
import { Comment } from '@models/Comment'

@ObjectType()
export class CommentSubscriptionPayload {
  @Field(() => MutationType)
  mutation: MutationType

  @Field({ nullable: true })
  data: Comment

  @Field({ nullable: true })
  deletedCommentId?: string
}
