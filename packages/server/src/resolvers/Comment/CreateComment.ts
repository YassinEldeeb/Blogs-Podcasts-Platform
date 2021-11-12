import { Auth } from '@middleware/Auth'
import { Comment } from '@models/Comment'
import { CREATED } from '@Types/enums/mutationType'
import { Topics } from '@Types/enums/subscriptions'
import { MyContext } from '@Types/MyContext'
import { NotificationTypes } from '@Types/NotificationsTypes'
import {
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
  Resolver,
  PubSubEngine,
  PubSub,
} from 'type-graphql'
import { notify } from '../shared/notifications/Notify'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CreateCommentInput } from './createComment/CreateCommentInput'

@Resolver()
class CreateCommentResolver {
  @Mutation((_type) => Comment)
  @UseMiddleware(Auth())
  async createComment(
    @Arg('data') data: CreateCommentInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any,
  ): Promise<Comment> {
    const selectWithDefault = {
      ...select,
      id: true,
      post: {
        select: { ...{ authorId: true }, ...(select?.post?.select || {}) },
      },
    }

    const newComment = (await prisma.comment.create({
      data: { ...data, authorId: userId! },
      select: selectWithDefault,
    })) as any

    await prisma.post.update({
      where: { id: data.postId },
      data: { comments_count: { increment: 1 } },
    })

    // Publish Data
    pubSub.publish(`${Topics.CommentsOnPost}:${data.postId}`, {
      mutation: CREATED,
      id: newComment.id,
    } as PublishedData)

    if (userId !== newComment.post.authorId) {
      const parentCommentAuthor = data.parentId
        ? await prisma.comment.findUnique({
            where: { id: data.parentId },
            select: { author: { select: { id: true } } },
          })
        : null
      if (
        parentCommentAuthor?.author.id
          ? parentCommentAuthor?.author.id !== newComment.post.authorId
          : true
      ) {
        notify({
          notifiedUserId: newComment.post.authorId,
          type: NotificationTypes.newComments,
          url: `/post/${data.postId}/comments`,
          firedNotificationUserId: userId!,
        })
      }

      if (data.parentId) {
        if (parentCommentAuthor)
          notify({
            notifiedUserId: parentCommentAuthor.author.id,
            type: NotificationTypes.reply,
            url: `/post/${data.postId}/comments/${parentCommentAuthor}`,
            firedNotificationUserId: userId!,
          })
      }
    }
    return newComment
  }
}
