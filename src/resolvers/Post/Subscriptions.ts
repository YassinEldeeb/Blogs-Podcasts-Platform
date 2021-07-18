import { Authorized, Root, Subscription } from 'type-graphql'
import { prisma } from '../../prisma'
import { MutationType } from '../../types/enums/mutationType'
import { Topics } from '../../types/enums/subscriptions'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'

const { DELETED } = MutationType

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

  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: ({ context: { userId } }) => `myPost:${userId}`,
  })
  @Authorized()
  async myPost(
    @Root() data: PublishedData,
    @Select() select: any
  ): Promise<PostSubscriptionPayload> {
    let post = null

    if (data.mutation !== DELETED) {
      post = (await prisma.post.findUnique({
        where: { id: data.id },
        select: { ...select },
      })) as any
    }

    return {
      mutation: data.mutation,
      data: post,
    }
  }
}

export { PostsSubscriptionsResolver }
