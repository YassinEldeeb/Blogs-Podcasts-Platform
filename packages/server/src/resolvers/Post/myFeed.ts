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
  myFeed(
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any,
  ): Promise<Post[]> {
    const following = { followers: { some: { follower_userId: userId } } }

    const feed: Prisma.PostWhereInput = {
      OR: [
        {
          author: following,
        },
        {
          hearts: {
            some: {
              user: following,
            },
          },
        },
        {
          comments: {
            some: { author: following },
          },
        },
      ],
      published: true,
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
