import { ObjectType, Field } from 'type-graphql'
import { PublishedData } from '../../shared/subscription/PublishedData'

@ObjectType()
export class HeartPublishedData extends PublishedData {
  @Field({ nullable: true })
  deletedHeartId?: string
}
