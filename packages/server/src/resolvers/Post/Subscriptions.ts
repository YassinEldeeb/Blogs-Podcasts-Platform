import { prisma } from '@/prisma'
import { DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { Authorized, Root, Subscription } from 'type-graphql'
import { Select } from '../shared/select/selectParamDecorator'
import { PostPublishedData } from './subscription/postPublished'
import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'

class PostsSubscriptionsResolver {
  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: Topics.Posts,
    filter: async ({ payload, context: { userId } }) => {
      const following = !!(await prisma.follower.findFirst({
        where: { followed_userId: payload.authorId, follower_userId: userId },
      }))

      return payload.authorId !== userId && following
    },
  })
  @Authorized()
  async myFeed(
    @Root() data: PostPublishedData,
    @Select() select: any,
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
      deletedPostId: data.deleted ? data.id : undefined,
    }
  }
}

export { PostsSubscriptionsResolver }
