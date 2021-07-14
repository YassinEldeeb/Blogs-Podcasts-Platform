import {
  Arg,
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
} from 'type-graphql'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { Comment } from '../../models/Comment'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CommentIdInput } from './shared/CommentIdExists'
import { UpdateCommentInput } from './updateComment/UpdateCommentInput'

const { UPDATED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class UpdateCommentResolver {
  @Mutation((_returns) => Comment)
  async updateComment(
    @Args() { id }: CommentIdInput,
    @Arg('data') data: UpdateCommentInput,
    @Ctx() { prisma }: MyContext,
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
