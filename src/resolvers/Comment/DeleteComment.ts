import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import {
  Resolver,
  Mutation,
  Ctx,
  Info,
  Args,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { ctx } from '../../types/ctx'
import { Comment } from '../../models/Comment'
import { CommentIdInput } from './shared/CommentIdExists'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { DELETED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class DeleteCommentResolver {
  @Mutation((_returns) => Comment)
  async deleteComment(
    @Args() { id }: CommentIdInput,
    @Ctx() { prisma }: ctx,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const deletedComment = (await prisma.comment.delete({
      where: { id },
      select: { ...select, postId: true, id: true },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${deletedComment.postId}`, {
      mutation: DELETED,
      id: deletedComment.id,
    } as PublishedData)

    return deletedComment
  }
}

export { DeleteCommentResolver }
