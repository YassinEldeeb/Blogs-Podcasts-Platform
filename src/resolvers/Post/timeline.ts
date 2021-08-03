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
  async timeline(
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<Post[]> {
    const following = await prisma.follower.findMany({
      where: { follower_userId: userId },
      select: { createdAt: true, followed_userId: true },
    })

    const followingIds = following.map((e) => e.followed_userId)
    const feed: Prisma.PostWhereInput = {
      author: {
        id: { in: followingIds },
      },
      published: true,
    }

    const selectWithDefault = {
      ...select,
      createdAt: true,
      author: {
        select: { ...{ id: true }, ...(select?.author?.select || {}) },
      },
    }

    const posts = (await prisma.post.findMany({
      where: feed,
      select: selectWithDefault,
      take,
      skip,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    })) as any

    const filteredPosts = posts.filter((post: any) => {
      const followingDate = following.find(
        (e) => e.followed_userId === post.author.id
      )!.createdAt

      return post.createdAt >= followingDate
    })

    return filteredPosts
  }
}

export { MyFeedResolver }
