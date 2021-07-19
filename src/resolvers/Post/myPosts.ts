import { Prisma } from '@prisma/client'
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Auth } from '../../middleware/Auth'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class MyPostsInput extends PaginationArgs {
  @Field({ nullable: true })
  published?: boolean
}

@Resolver()
class MyPostsResolver {
  @Query((_type) => [Post])
  @UseMiddleware(Auth())
  myPosts(
    @Args() { published, skip, take, cursorId }: MyPostsInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
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
      take,
      skip,
      select,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    })
  }
}

export { MyPostsResolver }
