import { Root, Subscription } from 'type-graphql'
import { DELETED } from '../../@types/enums/mutationType'
import { Topics } from '../../@types/enums/subscriptions'
import { prisma } from '../../prisma'
import { Select } from '../shared/select/selectParamDecorator'
import { PostPublishedData } from './subscription/postPublished'
import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'

class PostsSubscriptionsResolver {
  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: Topics.Posts,
  })
  async posts(
    @Root() data: PostPublishedData,
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
      deletedPostId: data.deletedPostId,
    }
  }
}

export { PostsSubscriptionsResolver }
