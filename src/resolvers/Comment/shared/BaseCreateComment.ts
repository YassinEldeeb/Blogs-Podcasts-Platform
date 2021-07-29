import { Auth } from '@/middleware/Auth'
import { notify } from '@/resolvers/shared/Notify'
import { CREATED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import { NotificationTypes } from '@/types/NotificationsTypes'
import {
  Arg,
  ClassType,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Select } from '../../shared/select/selectParamDecorator'
import { PublishedData } from '../../shared/subscription/PublishedData'

const { CommentsOnPost } = Topics

export function createCommentOrReplyBase<
  T extends ClassType,
  I extends ClassType
>(suffix: 'Reply' | 'Comment', returnType: T, input: I) {
  @Resolver()
  class BaseResolver {
    @Mutation((_type) => returnType, { name: `create${suffix}` })
    @UseMiddleware(Auth())
    async createBase(
      @Arg('data', () => input) data: any,
      @Ctx() { prisma, userId }: MyContext,
      @PubSub() pubSub: PubSubEngine,
      @Select() select: any
    ): Promise<T> {
      //@ts-ignore
      const newCommentOrReply = (await prisma[suffix.toLowerCase()].create({
        data: { ...data, authorId: userId! },
        select: { ...select, id: true, post: { select: { authorId: true } } },
      })) as any
      await prisma.post.update({
        where: { id: data.postId },
        data: { comments_count: { increment: 1 } },
      })

      // Publish Data
      pubSub.publish(`${CommentsOnPost}:${data.postId}`, {
        mutation: CREATED,
        id: newCommentOrReply.id,
      } as PublishedData)

      if (userId !== newCommentOrReply.post.authorId)
        notify(
          newCommentOrReply.post.authorId,
          NotificationTypes.newComments,
          `/post/${data.postId}/comments`,
          userId!
        )

      return newCommentOrReply
    }
  }

  return BaseResolver
}
