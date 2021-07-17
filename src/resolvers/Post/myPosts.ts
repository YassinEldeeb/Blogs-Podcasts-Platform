import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Auth } from '../../middleware/Auth'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Prisma } from '@prisma/client'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class MyPostsResolver {
  @Query((_type) => [Post])
  @Auth()
  myPosts(
    @Arg('published', { nullable: true }) published: boolean,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ) {
    const where: Prisma.PostWhereInput = {
      authorId: userId,
    }

    if (published !== undefined) {
      where.published = published
    }

    return prisma.post.findMany({
      where,
      select,
    })
  }
}

export { MyPostsResolver }
