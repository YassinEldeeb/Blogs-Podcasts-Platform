import { PrismaSelect } from '@paljs/plugins'
import { Prisma } from '@prisma/client'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, Info, Query, Resolver } from 'type-graphql'
import { ctx } from '../../types/ctx'
import { Post } from '../../models/Post'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class PostsResolver {
  @Query(() => [Post])
  posts(
    @Arg('query', { nullable: true }) searchQuery: string,
    @Ctx() { prisma }: ctx,
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
