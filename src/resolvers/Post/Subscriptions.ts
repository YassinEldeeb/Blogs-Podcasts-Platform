import { Subscription, Root, Ctx, Info } from 'type-graphql'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { GraphQLResolveInfo } from 'graphql'
import { ctx } from '../../types/ctx'
import { PrismaSelect } from '@paljs/plugins'
import { PostSubscriptionPayload } from './subscription/PostSubscriptionPayload'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { Posts } = Topics
const { DELETED } = MutationType

class PostsSubscriptionsResolver {
  @Subscription((_returns) => PostSubscriptionPayload, {
    topics: Posts,
  })
  async posts(
    @Root() data: PublishedData,
    @Ctx() { prisma }: ctx,
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
