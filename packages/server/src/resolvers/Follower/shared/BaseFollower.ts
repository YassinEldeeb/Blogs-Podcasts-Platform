import { Prisma } from '@prisma/client'
import { Follower } from '@models/Follower'
import { Arg, Args, ArgsType, Ctx, Field, Query, Resolver } from 'type-graphql'
import { MyContext } from '@Types/MyContext'
import { PaginationArgs } from '../../shared/pagination'
import { Select } from '../../shared/select/selectParamDecorator'
import { SortingArgs } from '../../shared/sorting'

@ArgsType()
class FollowersInput extends PaginationArgs {
  @Field()
  userId: string
}

export function followerBaseResolver(name: 'followers' | 'following') {
  @Resolver()
  class BaseResolver {
    @Query((_type) => [Follower], { name })
    async follower(
      @Args() { userId, skip, take, cursorId }: FollowersInput,
      @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
      @Ctx() { prisma }: MyContext,
      @Select({}, false) select: any,
    ): Promise<Follower[]> {
      let where: Prisma.FollowerWhereInput =
        name === 'followers'
          ? { followed_userId: userId }
          : { follower_userId: userId }

      return prisma.follower.findMany({
        where,
        select,
        skip,
        take,
        orderBy,
        cursor: cursorId ? { id: cursorId } : undefined,
      }) as any
    }
  }

  return BaseResolver
}
