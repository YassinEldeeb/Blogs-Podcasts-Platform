import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { notify } from '@/resolvers/shared/notifications/Notify'
import { Select } from '@/resolvers/shared/select/selectParamDecorator'
import { PublishedData } from '@/resolvers/shared/subscription/PublishedData'
import { models } from '@/types/enums/models'
import { DELETED } from '@/types/enums/mutationType'
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

const { CommentsOnPost } = Topics

export function deleteCommentOrReplyBase<T extends ClassType>(
  suffix: 'Reply' | 'Comment',
  returnType: T
) {
  @Resolver()
  class BaseResolver {
    @Mutation((_type) => returnType, { name: `delete${suffix}` })
    @UseMiddleware(Auth())
    @IsOwner(
      //@ts-ignore
      models[suffix.toLowerCase()]
    )
    async deleteBase(
      @Arg('id') id: string,
      @Ctx() { prisma, userId }: MyContext,
      @PubSub() pubSub: PubSubEngine,
      @Select() select: any
    ): Promise<T> {
      //@ts-ignore
      const deletedCommentOrReply = (await prisma[suffix.toLowerCase()].delete({
        where: { id },
        select: {
          ...select,
          postId: true,
          id: true,
          post: { select: { authorId: true } },
        },
      })) as any

      await prisma.post.update({
        where: { id: deletedCommentOrReply.postId },
        data: { comments_count: { decrement: 1 } },
      })

      // Publish Data
      pubSub.publish(`${CommentsOnPost}:${deletedCommentOrReply.postId}`, {
        mutation: DELETED,
        id: deletedCommentOrReply.id,
      } as PublishedData)

      if (userId !== deletedCommentOrReply.post.authorId)
        notify({
          notifiedUserId: deletedCommentOrReply.post.authorId,
          type: NotificationTypes.newComments,
          url: `/post/${deletedCommentOrReply.postId}/comments}`,
          firedNotificationUserId: userId!,
          options: { remove: true },
        })

      return deletedCommentOrReply
    }
  }

  return BaseResolver
}
