import { Prisma } from '@prisma/client'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class PostsResolver {
  @Query(() => [Post])
  posts(
    @Arg('search', { nullable: true }) search: string,
    @Arg('authorId', { nullable: true }) authorId: string,
    @Ctx()
    { prisma }: MyContext,
    @Select() select: any
  ): Promise<Post[]> {
    const where: Prisma.PostWhereInput = { published: true }

    if (search) {
      const filter = {
        contains: search,
        mode: 'insensitive',
      } as any

      where.OR = {
        ...where,
        OR: [
          {
            title: filter,
          },
          {
            body: filter,
          },
        ],
      }
    }
    if (authorId) {
      where.authorId = authorId
    }

    return prisma.post.findMany({
      where,
      select,
    }) as any
  }
}

export { PostsResolver }
