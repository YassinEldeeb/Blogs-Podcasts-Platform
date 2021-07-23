import {
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { FollowInput } from './follow/followInput'

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
    @Args() { user_id: UserIdToFollow }: FollowInput,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<UnFollowPayload> {
    const followed = await prisma.follower.findFirst({
      where: { followed_userId: UserIdToFollow, follower_userId: userId! },
      select: { id: true },
    })

    if (!followed) {
      throw new Error("You're not following him!")
    }

    await prisma.follower.deleteMany({
      where: { followed_userId: UserIdToFollow, follower_userId: userId! },
    })

    return { unFollowed: true }
  }
}

export { FollowResolver }
