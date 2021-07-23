import { Args, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { Follower } from '../../models/Follower'
import { Select } from '../shared/select/selectParamDecorator'
import { FollowInput } from './follow/followInput'

@Resolver()
class FollowResolver {
  @Mutation((_type) => Follower)
  @UseMiddleware(Auth())
  async follow(
    @Args() { user_id: UserIdToFollow }: FollowInput,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
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
    return prisma.follower.create({
      data: { followed_userId: UserIdToFollow, follower_userId: userId! },
      select,
    })
  }
}

export { FollowResolver }
