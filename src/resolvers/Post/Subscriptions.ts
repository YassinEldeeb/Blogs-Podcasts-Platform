import { Ctx, Root, Subscription } from 'type-graphql'
import { MutationType } from '../../types/enums/mutationType'
import { Topics } from '../../types/enums/subscriptions'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'

const { Posts } = Topics
const { DELETED } = MutationType

class PostsSubscriptionsResolver {
  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: Posts,
  })
  async posts(
    @Root() data: PublishedData,
    @Ctx() { prisma }: MyContext,
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
}

export { PostsSubscriptionsResolver }
