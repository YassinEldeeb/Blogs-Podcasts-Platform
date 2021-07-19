import { Prisma } from '@prisma/client'
import { Arg, Args, ArgsType, Ctx, Field, Query, Resolver } from 'type-graphql'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'

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
  posts(
    @Args() { authorId, search, take, skip, cursorId }: PostsInput,
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
      take,
      skip,
      select,
      cursor: cursorId ? { id: cursorId } : undefined,
    }) as any
  }
}

export { PostsResolver }
