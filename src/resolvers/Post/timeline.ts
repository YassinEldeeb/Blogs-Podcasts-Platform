import { Auth } from '@/middleware/Auth'
import { Post } from '@/models/Post'
import { MyContext } from '@/types/MyContext'
import { Prisma } from '@prisma/client'
import { Arg, Args, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@Resolver()
class MyFeedResolver {
  @Query((_type) => [Post])
  @UseMiddleware(Auth())
  timeline(
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<Post[]> {
    const feed: Prisma.PostWhereInput = {
      author: {
        followers: {
          some: {
            follower_userId: userId,
          },
        },
      },
    }

    return prisma.post.findMany({
      where: feed,
      select,
      take,
      skip,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    }) as any
  }
}

export { MyFeedResolver }
