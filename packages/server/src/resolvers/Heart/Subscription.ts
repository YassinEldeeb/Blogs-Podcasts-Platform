import { Topics } from '@/types/enums/subscriptions'
import { Arg, Root, Subscription } from 'type-graphql'
import { pubsub } from '../../app'
import { Select } from '../shared/select/selectParamDecorator'
import { checkPostExistance } from '../shared/validations/shared/checkPostExistance'
import { ReturnHeart } from './shared/ReturnHeart'
import { HeartPublishedData } from './subscription/heartPublished'
import { HeartSubscriptionPayload } from './subscription/heartSubscriptionPayload'

class HeartsSubscriptionResolver {
  @Subscription((_returns) => HeartSubscriptionPayload, {
    subscribe: (_root, { postId }): any => {
      const topicName = `${Topics.HeartsOnPost}:${postId}`

      return checkPostExistance(postId).then((post) => {
        if (!post) {
          throw new Error('Post not Found')
        }
        return pubsub.asyncIterator(topicName)
      })
    },
  })
  async hearts(
    @Root() data: HeartPublishedData,
    @Arg('postId') _postId: string,
    @Select() select: any,
  ): Promise<HeartSubscriptionPayload> {
    return ReturnHeart(data, select)
  }
}

export { HeartsSubscriptionResolver }
