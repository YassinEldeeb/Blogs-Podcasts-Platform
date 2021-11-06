import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { Comment } from '@/models/Comment'
import { models } from '@/types/enums/models'
import { DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import { NotificationTypes } from '@/types/NotificationsTypes'
import {
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
  Resolver,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { notify } from '../shared/notifications/Notify'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'

@Resolver()
class BaseResolver {
  @Mutation((_type) => Comment)
  @UseMiddleware(Auth())
  @IsOwner(models.comment)
  async deleteComment(
    @Arg('id') id: string,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const selectWithDefault = {
      ...select,
      postId: true,
      id: true,
      post: {
        select: { ...{ authorId: true }, ...(select?.post?.select || {}) },
      },
    }

    const deletedComment = (await prisma.comment.delete({
      where: { id },
      select: selectWithDefault,
    })) as any

    await prisma.post.update({
      where: { id: deletedComment.postId },
      data: { comments_count: { decrement: 1 } },
    })

    // Publish Data
    pubSub.publish(`${Topics.CommentsOnPost}:${deletedComment.postId}`, {
      mutation: DELETED,
      id: deletedComment.id,
    } as PublishedData)

    if (userId !== deletedComment.post.authorId)
      notify({
        notifiedUserId: deletedComment.post.authorId,
        type: NotificationTypes.newComments,
        url: `/post/${deletedComment.postId}/comments}`,
        firedNotificationUserId: userId!,
        options: { remove: true },
      })

    return deletedComment
  }
}
