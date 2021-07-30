import {
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { CREATED, DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import { Auth } from '@/middleware/Auth'
import { PostIdInput } from '../Post/shared/PostIdExists'
import { notify } from '../shared/notifications/Notify'
import { NotificationTypes } from '@/types/NotificationsTypes'

@ObjectType()
class HeartPostPayload {
  @Field()
  heart: boolean
}

@Resolver()
class HeartPostResolver {
  @Mutation((_return) => HeartPostPayload)
  @UseMiddleware(Auth())
  async heartPost(
    @Args() { postId }: PostIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<HeartPostPayload> {
    const hearted = (await prisma.heart.findFirst({
      where: { postId, authorId: userId },
      select: {
        id: true,
        post: { select: { id: true, author: { select: { id: true } } } },
      },
    })) as any

    if (!hearted) {
      const heart = (await prisma.heart.create({
        data: { authorId: userId!, postId },
        include: {
          post: { select: { id: true, author: { select: { id: true } } } },
        },
      })) as any
      await prisma.post.update({
        where: { id: postId },
        data: { hearts_count: { increment: 1 } },
      })

      pubSub.publish(`${Topics.HeartsOnPost}:${heart.post.id}`, {
        mutation: CREATED,
        id: heart.id,
        authorId: userId,
      })

      if (userId !== heart.post.author.id)
        notify({
          notifiedUserId: heart.post.author.id,
          type: NotificationTypes.heartOnPost,
          url: `/posts/${heart.post.id}`,
          firedNotificationUserId: userId!,
        })
      return { heart: true }
    } else {
      await prisma.heart.deleteMany({
        where: { authorId: userId!, postId },
      })
      await prisma.post.update({
        where: { id: postId },
        data: { hearts_count: { decrement: 1 } },
      })

      pubSub.publish(`${Topics.HeartsOnPost}:${hearted.post.id}`, {
        mutation: DELETED,
        id: hearted.id,
        authorId: userId,
        deletedHeartId: hearted.id,
      })

      if (userId !== hearted.post.author.id)
        notify({
          notifiedUserId: hearted.post.author.id,
          type: NotificationTypes.heartOnPost,
          url: `/posts/${hearted.post.id}`,
          firedNotificationUserId: userId!,
          options: { remove: true },
        })

      return { heart: false }
    }
  }
}

export { HeartPostResolver }
