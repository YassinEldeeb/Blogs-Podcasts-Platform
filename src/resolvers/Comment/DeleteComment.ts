import {
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

const { DELETED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class DeleteCommentResolver {
  @Mutation((_returns) => Comment)
  async deleteComment(
    @Args() { id }: CommentIdInput,
    @Ctx() { prisma }: MyContext,
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
