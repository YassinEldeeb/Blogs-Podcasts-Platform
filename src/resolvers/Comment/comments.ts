import { Args, Ctx, ObjectType, Query, Resolver } from 'type-graphql'
import { Comment } from '../../models/Comment'
import { MyContext } from '../../types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class CommentsResolver {
  @Query((_returns) => [Comment])
  comments(
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { post: { published: true } },
      select,
      skip,
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
    }) as any
  }
}

export { CommentsResolver }
