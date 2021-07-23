import { Authorized, Root, Subscription } from 'type-graphql'
import { CREATED, DELETED } from '../../@types/enums/mutationType'
import { Topics } from '../../@types/enums/subscriptions'
import { prisma } from '../../prisma'
import {
  heartMutationType,
  HeartSubscriptionPayload,
} from '../Heart/subscription/heartSubscriptionPayload'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'

import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'

class PostsSubscriptionsResolver {
  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: Topics.Posts,
  })
  async posts(
    @Root() data: PublishedData,
    @Select() select: any
  ): Promise<PostSubscriptionPayload> {
    let post = null

    if (data.mutation !== DELETED) {
      post = (await prisma.post.findUnique({
        where: { id: data.id },
        select,
      })) as any
    }

    return {
      mutation: data.mutation,
      data: post,
    }
  }

  @Subscription((_returns) => HeartSubscriptionPayload, {
    topics: ({ context: { userId } }) => `myPostsHearts:${userId}`,
    filter: async ({ payload, context: { userId } }) => {
      console.log(payload.userId, userId)
      return payload.userId !== userId
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

export { PostsSubscriptionsResolver }
