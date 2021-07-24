import { ObjectType, Field } from 'type-graphql'
import { PublishedData } from '../../shared/subscription/PublishedData'

@ObjectType()
export class FollowerPublishedData extends PublishedData {
  deleted?: boolean = false
}
