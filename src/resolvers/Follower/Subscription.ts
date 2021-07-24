import { Arg, Root, Subscription } from 'type-graphql'
import { Topics } from '../../@types/enums/subscriptions'
import { pubsub } from '../../app'
import { prisma } from '../../prisma'
import { Select } from '../shared/select/selectParamDecorator'
import { checkUserExistance } from '../shared/validations/shared/checkUserExists'
import { FollowerPublishedData } from './Subscription/FollowerPublished'
import { FollowerSubscriptionPayload } from './Subscription/FollowerSubscriptionPayload'

class FollowerSubscriptionResolver {
  @Subscription((_returns) => FollowerSubscriptionPayload, {
    subscribe: (_root, { userId }): any => {
      const topicName = `${Topics.followersOfUser}:${userId}`

      return checkUserExistance({ id: userId }).then((user) => {
        if (!user) {
          throw new Error('User not Found')
        }
        return pubsub.asyncIterator(topicName)
      })
    },
  })
  async followers(
    @Root() data: FollowerPublishedData,
    @Arg('userId') _postId: string,
    @Select() select: any
  ): Promise<FollowerSubscriptionPayload> {
    const follower = (await prisma.follower.findUnique({
      where: { id: data.id },
      select,
    })) as any

    return {
      mutation: data.mutation,
      data: follower,
      unFollowedId: data.deleted ? data.id : undefined,
    }
  }
}

export { FollowerSubscriptionResolver }
