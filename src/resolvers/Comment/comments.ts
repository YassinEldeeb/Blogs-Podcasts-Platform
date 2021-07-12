import { Resolver, Query, Ctx, Info } from 'type-graphql'
import { Comment } from '../../models/Comment'
import { GraphQLResolveInfo } from 'graphql'
import { ctx } from '../../types/ctx'
import { PrismaSelect } from '@paljs/plugins'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class CommentsResolver {
  @Query((_returns) => [Comment])
  comments(@Ctx() { prisma }: ctx, @Select() select: any): Promise<Comment[]> {
    return prisma.comment.findMany({ select }) as any
  }
}

export { CommentsResolver }
