import { Authorized, Root, Subscription } from 'type-graphql'
import { Topics } from '@/types/enums/subscriptions'
import { Select } from '../shared/select/selectParamDecorator'
import { ReturnHeart } from './shared/ReturnHeart'
import { HeartPublishedData } from './subscription/heartPublished'
import { HeartSubscriptionPayload } from './subscription/heartSubscriptionPayload'

class HeartsOnPostsSubscriptionResolver {
  @Subscription((_returns) => HeartSubscriptionPayload, {
    topics: ({ context: { userId } }) => `${Topics.myPostsHearts}:${userId}`,
    filter: async ({ payload, context: { userId } }) => {
      return payload.authorId !== userId
    },
  })
  @Authorized()
  async myHeartsNotifications(
    @Root() data: HeartPublishedData,
    @Select() select: any
  ): Promise<HeartSubscriptionPayload> {
    return ReturnHeart(data, select)
  }
}

export { HeartsOnPostsSubscriptionResolver }
