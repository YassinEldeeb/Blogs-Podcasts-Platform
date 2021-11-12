import { Auth } from '@middleware/Auth'
import { notify } from '@resolvers/shared/notifications/Notify'
import { CREATED, DELETED } from '@Types/enums/mutationType'
import { Topics } from '@Types/enums/subscriptions'
import { MyContext } from '@Types/MyContext'
import { NotificationTypes } from '@Types/NotificationsTypes'
import {
  Args,
  ClassType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'

@ObjectType()
class HeartPayload {
  @Field()
  heart: boolean
}

function createBaseHeart<I extends ClassType>(suffix: string, input: I) {
  @Resolver()
  class BaseHeartResolver {
    @Mutation((_return) => HeartPayload, { name: `heart${suffix}` })
    @UseMiddleware(Auth())
    async heartSomething(
      @Args(() => input) input: any,
      @Ctx() { prisma, userId }: MyContext,
      @PubSub() pubSub: PubSubEngine,
    ): Promise<HeartPayload> {
      const whereParentId: any = {}
      const inputKey = Object.keys(input)[0]
      const type = inputKey.includes('post') ? 'post' : 'comment'

      whereParentId[inputKey] = input[inputKey]

      const heartSelect = () => {
        const authorSelection = {
          select: { id: true, author: { select: { id: true } } },
        }

        if (type === 'post') {
          return {
            post: authorSelection,
          }
        }
        return {
          comment: authorSelection,
        }
      }

      const hearted = (await prisma.heart.findFirst({
        where: { ...whereParentId, authorId: userId },
        select: {
          id: true,
          ...heartSelect(),
        },
      })) as any

      if (!hearted) {
        const heart = (await prisma.heart.create({
          data: { authorId: userId!, ...whereParentId },
          select: { ...heartSelect() },
        })) as any

        await (prisma[type] as any).update({
          where: { id: input[inputKey] },
          data: { hearts_count: { increment: 1 } },
        })

        if (type === 'post')
          pubSub.publish(`${Topics.HeartsOnPost}:${heart[type].id}`, {
            mutation: CREATED,
            id: heart.id,
            authorId: userId,
          })

        if (userId !== heart[type].author.id) {
          if (type === 'post') {
            notify({
              notifiedUserId: heart[type].author.id,
              type: NotificationTypes.heartOnPost,
              url: `/posts/${heart[type].id}`,
              firedNotificationUserId: userId!,
            })
          } else if (type === 'comment') {
            notify({
              notifiedUserId: heart[type].author.id,
              type: NotificationTypes.heartOnReply,
              url: `/posts/${heart[type].id}/comments/${input[inputKey]}`,
              firedNotificationUserId: userId!,
            })
          }
        }

        return { heart: true }
      } else {
        await prisma.heart.deleteMany({
          where: { authorId: userId!, ...whereParentId },
        })
        await (prisma[type] as any).update({
          where: { id: input[inputKey] },
          data: { hearts_count: { decrement: 1 } },
        })

        pubSub.publish(`${Topics.HeartsOnPost}:${hearted[type].id}`, {
          mutation: DELETED,
          id: hearted.id,
          authorId: userId,
          deletedHeartId: hearted.id,
        })

        if (userId !== hearted[type].author.id) {
          if (type === 'post') {
            notify({
              notifiedUserId: hearted[type].author.id,
              type: NotificationTypes.heartOnPost,
              url: `/posts/${hearted[type].id}`,
              firedNotificationUserId: userId!,
              options: { remove: true },
            })
          } else if (type === 'comment') {
            notify({
              notifiedUserId: hearted[type].author.id,
              type: NotificationTypes.heartOnReply,
              url: `/posts/${hearted[type].id}/comments/${input[inputKey]}`,
              firedNotificationUserId: userId!,
              options: { remove: true },
            })
          }
        }

        return { heart: false }
      }
    }
  }
}
export { createBaseHeart }
