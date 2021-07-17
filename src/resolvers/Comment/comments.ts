import { Ctx, Query, Resolver } from 'type-graphql'
import { Comment } from '../../models/Comment'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class CommentsResolver {
  @Query((_returns) => [Comment])
  comments(
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ): Promise<Comment[]> {
    return prisma.comment.findMany({ select }) as any
  }
}

export { CommentsResolver }
