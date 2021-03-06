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
import { DELETED } from '@Types/enums/mutationType'
import { Topics } from '@Types/enums/subscriptions'
import { MyContext } from '@Types/MyContext'
import { Auth } from '@middleware/Auth'
import { PublishedData } from '../shared/subscription/PublishedData'
import { FollowInput } from './follow/followInput'
import { notify } from '../shared/notifications/Notify'
import { NotificationType } from '@Types/NotificationType'

@ObjectType()
class UnFollowPayload {
  @Field()
  unFollowed: boolean
}

@Resolver()
class FollowResolver {
  @Mutation((_type) => UnFollowPayload)
  @UseMiddleware(Auth())
  async unFollow(
    @Args() { user_id: UserIdToUnFollow }: FollowInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<UnFollowPayload> {
    const followed = await prisma.follower.findFirst({
      where: { followed_userId: UserIdToUnFollow, follower_userId: userId! },
      select: { id: true },
    })

    if (!followed) {
      throw new Error("You're not following him!")
    }

    await prisma.follower.deleteMany({
      where: { followed_userId: UserIdToUnFollow, follower_userId: userId! },
    })

    await prisma.user.update({
      data: { following_count: { decrement: 1 } },
      where: { id: userId },
    })

    await prisma.user.update({
      data: { followers_count: { decrement: 1 } },
      where: { id: UserIdToUnFollow },
    })

    // Publish Data
    pubSub.publish(`${Topics.followersOfUser}:${UserIdToUnFollow}`, {
      mutation: DELETED,
      id: followed.id,
      deleted: true,
    } as PublishedData)

    notify({
      notifiedUserId: UserIdToUnFollow,
      type: NotificationType.newFollowers,
      url: `/users/${userId}`,
      firedNotificationUserId: userId!,
      options: { remove: true },
    })

    return { unFollowed: true }
  }
}

export { FollowResolver }
