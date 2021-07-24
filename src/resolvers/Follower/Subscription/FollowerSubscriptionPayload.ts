import { Field, ObjectType } from 'type-graphql'
import { MutationType } from '../../../@types/enums/mutationType'
import { Follower } from '../../../models/Follower'

@ObjectType()
export class FollowerSubscriptionPayload {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field({ nullable: true })
  data: Follower

  @Field({ nullable: true })
  unFollowedId?: string
}
