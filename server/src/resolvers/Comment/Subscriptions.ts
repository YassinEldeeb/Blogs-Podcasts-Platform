import { Arg, Root, Subscription } from 'type-graphql'
import { DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { pubsub } from '../../app'
import { prisma } from '@/prisma'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { checkPostExistance } from '../shared/validations/shared/checkPostExistance'
import { CommentSubscriptionPayload } from './subscription/CommentSubscriptionPayload'

const { CommentsOnPost } = Topics

class CommentsSubscriptionsResolver {
  @Subscription((_returns) => CommentSubscriptionPayload, {
    subscribe: (_root, { postId }): any => {
      const topicName = `${CommentsOnPost}:${postId}`
      return checkPostExistance(postId).then((post) => {
        if (!post) {
          throw new Error('Post not Found')
        }
        return pubsub.asyncIterator(topicName)
      })
    },
  })
  async comments(
    @Root() data: PublishedData,
    @Arg('postId') _id: string,
    @Select() select: any
  ): Promise<CommentSubscriptionPayload> {
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
      deletedCommentId: data.id,
    }
  }
}

export { CommentsSubscriptionsResolver }
