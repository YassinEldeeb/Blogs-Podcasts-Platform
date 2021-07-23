import { Subscription, Authorized, Root } from 'type-graphql'
import { CREATED } from '../../@types/enums/mutationType'
import { prisma } from '../../prisma'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import {
  heartMutationType,
  HeartSubscriptionPayload,
} from './subscription/heartSubscriptionPayload'

class HeartsOnPostsSubscriptionResolver {
  @Subscription((_returns) => HeartSubscriptionPayload, {
    topics: ({ context: { userId } }) => `myPostsHearts:${userId}`,
    filter: async ({ payload, context: { userId } }) => {
      return payload.authorId !== userId
    },
  })
  @Authorized()
  async heartsOnMyPosts(
    @Root() data: PublishedData,
    @Select() select: any
  ): Promise<HeartSubscriptionPayload> {
    let post = null

    post = (await prisma.heart.findUnique({
      where: { id: data.id },
      select: { ...select },
    })) as any

    if (data.mutation === CREATED) {
      return {
        data: post,
        mutation: heartMutationType.LIKED,
      }
    } else {
      return {
        data: post,
        deletedHeartId: data.deletedHeartId,
        mutation: heartMutationType.DISLIKED,
      }
    }
  }
}

export { HeartsOnPostsSubscriptionResolver }
