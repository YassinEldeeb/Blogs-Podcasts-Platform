import { Auth } from '@/middleware/Auth'
import { Follower } from '@/models/Follower'
import { User } from '@/models/User'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@Resolver((_of) => User)
class followedByResolver {
  @FieldResolver((_type) => [Follower])
  @UseMiddleware(Auth())
  async followedBy(
    @Root() user: User,
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<Follower[]> {
    const followingIds = (
      await prisma.follower.findMany({
        where: { follower_userId: userId },
        select: { followed_userId: true },
      })
    ).map((e: { followed_userId: string }) => e.followed_userId)

    return prisma.follower.findMany({
      where: {
        follower_userId: { in: followingIds },
        followed_userId: user.id,
      },
      select,
    }) as any
  }
}

export { followedByResolver }
