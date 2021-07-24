import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { CREATED } from '../../@types/enums/mutationType'
import { Topics } from '../../@types/enums/subscriptions'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { Follower } from '../../models/Follower'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { FollowInput } from './follow/followInput'

@Resolver()
class FollowResolver {
  @Mutation((_type) => Follower)
  @UseMiddleware(Auth())
  async follow(
    @Args() { user_id: UserIdToFollow }: FollowInput,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any,
    @PubSub() pubSub: PubSubEngine
  ) {
    const followed = await prisma.follower.findFirst({
      where: { followed_userId: UserIdToFollow, follower_userId: userId! },
      select: { id: true },
    })

    if (followed) {
      throw new Error('Aleady Followed!')
    }

    if (UserIdToFollow === userId) {
      throw new Error("Can't Follow Yourself!")
    }

    const follow = (await prisma.follower.create({
      data: { followed_userId: UserIdToFollow, follower_userId: userId! },
      select: { ...select, id: true },
    })) as any

    console.log('FROM FOLLOWING', `${Topics.followersOfUser}:${UserIdToFollow}`)
    // Publish Data
    pubSub.publish(`${Topics.followersOfUser}:${UserIdToFollow}`, {
      mutation: CREATED,
      id: follow.id,
    } as PublishedData)

    return follow
  }
}

export { FollowResolver }
