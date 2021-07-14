import { Prisma } from '@prisma/client'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class PostsResolver {
  @Query(() => [Post])
  posts(
    @Arg('query', { nullable: true }) searchQuery: string,
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ): Promise<Post[]> {
    let where: Prisma.PostWhereInput = {}
    const query = searchQuery?.toLowerCase()

    if (query) {
      where = {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            body: {
              contains: query,
            },
          },
        ],
      }
    }

    return prisma.post.findMany({
      where,
      select,
    }) as any
  }
}

export { PostsResolver }
