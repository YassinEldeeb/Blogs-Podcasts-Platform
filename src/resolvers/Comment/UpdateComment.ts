import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import {
  Resolver,
  Mutation,
  Ctx,
  Info,
  Arg,
  Args,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { ctx } from '../../types/ctx'
import { Comment } from '../../models/Comment'
import { UpdateCommentInput } from './updateComment/UpdateCommentInput'
import { CommentIdInput } from './shared/CommentIdExists'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { UPDATED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class UpdateCommentResolver {
  @Mutation((_returns) => Comment)
  async updateComment(
    @Args() { id }: CommentIdInput,
    @Arg('data') data: UpdateCommentInput,
    @Ctx() { prisma }: ctx,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const updatedComment = (await prisma.comment.update({
      where: { id },
      data,
      select: { ...select, id: true, postId: true },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${updatedComment.postId}`, {
      mutation: UPDATED,
      id: updatedComment.id,
    } as PublishedData)

    return updatedComment
  }
}

export { UpdateCommentResolver }
