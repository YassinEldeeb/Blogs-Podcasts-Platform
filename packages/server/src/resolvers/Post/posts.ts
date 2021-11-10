import { Post } from '@/models/Post'
import { MyContext } from '@/types/MyContext'
import { Prisma } from '@prisma/client'
import { Arg, Args, ArgsType, Ctx, Field, Query, Resolver } from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class PostsInput extends PaginationArgs {
  @Field({ nullable: true })
  search: string

  @Field({ nullable: true })
  authorId: string
}

@Resolver()
class PostsResolver {
  @Query(() => [Post])
  async posts(
    @Args() { authorId, search, take, skip, cursorId }: PostsInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma }: MyContext,
    @Select() select: any,
  ): Promise<Post[]> {
    const where: Prisma.PostWhereInput = { published: true }

    if (search) {
      const parsedSearch = search.replace('#', '').toLowerCase()
      const filter = {
        contains: parsedSearch,
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
          {
            tags: { has: parsedSearch },
          },
          {
            author: { name: { contains: parsedSearch, mode: 'insensitive' } },
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
      take,
      skip,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    }) as any
  }
}

export { PostsResolver }
