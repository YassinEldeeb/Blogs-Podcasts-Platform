import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { models } from '@/types/enums/models'
import { DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { Comment } from '@/models/Comment'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CommentIdInput } from './shared/CommentIdExists'

const { CommentsOnPost, CommentsOnMyPosts } = Topics

@Resolver()
class DeleteCommentResolver {
  @Mutation((_returns) => Comment)
  @UseMiddleware(Auth())
  @IsOwner(models.comment)
  async deleteComment(
    @Args() { id }: CommentIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const deletedComment = (await prisma.comment.delete({
      where: { id },
      select: {
        ...select,
        postId: true,
        id: true,
        post: { select: { authorId: true } },
      },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${deletedComment.postId}`, {
      mutation: DELETED,
      id: deletedComment.id,
    } as PublishedData)

    pubSub.publish(`${CommentsOnMyPosts}:${deletedComment.post.authorId}`, {
      mutation: DELETED,
      id: deletedComment.id,
      deleted: true,
      authorId: userId,
    } as PublishedData)

    return deletedComment
  }
}

export { DeleteCommentResolver }
