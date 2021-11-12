import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { Heart } from '@models/Heart'

export enum heartMutationType {
  LIKED = 'LIKED',
  DISLIKED = 'DISLIKED',
}

registerEnumType(heartMutationType, {
  name: 'HeartType',
})

@ObjectType()
export class HeartSubscriptionPayload {
  @Field((_type) => heartMutationType)
  mutation: heartMutationType

  @Field({ nullable: true })
  deletedHeartId?: string

  @Field({ nullable: true })
  data: Heart
}
