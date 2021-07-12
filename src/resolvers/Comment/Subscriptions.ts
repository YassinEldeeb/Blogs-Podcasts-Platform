import { Subscription, Root, Arg, Info, Ctx } from 'type-graphql'
import { PrismaSelect } from '@paljs/plugins'
import { Topics } from '../../enums/subscriptions'
import { MutationType } from '../../enums/mutationType'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CommentSubscriptionPayload } from './subscription/CommentSubscriptionPayload'
import { GraphQLResolveInfo } from 'graphql'
import { ctx } from '../../types/ctx'
import { checkPostExistance } from '../shared/validations/shared/checkPostExistance'
import { Select } from '../shared/selectParamDecorator'

const { CommentsOnPost } = Topics
const { DELETED } = MutationType

class CommentsSubscriptionsResolver {
  @Subscription((_returns) => CommentSubscriptionPayload, {
    subscribe: (_root, { postId }, { pubsub }): any => {
      const topicName = `${CommentsOnPost}:${postId}`

      return checkPostExistance(postId).then((post) => {
        if (!post) {
          return { error: { message: 'Post not Found' } } as any
        }
        return pubsub.asyncIterator(topicName)
      })
    },
  })
  async comments(
    @Root() data: PublishedData,
    @Arg('postId') _id: string,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<CommentSubscriptionPayload> {
    console.log(select)
    let comment = null

    if (data.mutation !== DELETED) {
      comment = (await prisma.comment.findUnique({
        where: { id: data.id },
        select,
      })) as any
    }

    return {
      mutation: data.mutation,
      data: comment,
    }
  }
}

export { CommentsSubscriptionsResolver }
