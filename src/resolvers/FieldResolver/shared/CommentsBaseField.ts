import { Comment } from '@/models/Comment'
import { Post } from '@/models/Post'
import { User } from '@/models/User'
import { PaginationArgs } from '@/resolvers/shared/pagination'
import { Select } from '@/resolvers/shared/select/selectParamDecorator'
import { SortingArgs } from '@/resolvers/shared/sorting'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  Args,
  ClassType,
  Ctx,
  FieldResolver,
  Resolver,
  Root,
} from 'type-graphql'

export function commentsBaseResolver<T extends ClassType>(
  by: 'authorId' | 'postId',
  returnType: T
) {
  @Resolver((_of) => returnType)
  class BaseCommentsResolver {
    @FieldResolver((_type) => [Comment])
    comments(
      @Root() user: Post,
      @Args() { take, skip, cursorId }: PaginationArgs,
      @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
      @Ctx() { commentsLoader }: MyContext,
      @Select() select: any
    ) {
      return commentsLoader.load({
        id: user.id,
        select,
        args: { take, skip, cursorId, orderBy },
        by,
      })
    }
  }

  return BaseCommentsResolver
}
