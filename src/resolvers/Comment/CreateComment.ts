import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { CREATED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import { Auth } from '@/middleware/Auth'
import { Comment } from '@/models/Comment'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CreateCommentInput } from './createComment/CreateCommentInput'

const { CommentsOnPost, CommentsOnMyPosts } = Topics

@Resolver()
class CreateCommentResolver {
  @Mutation((_returns) => Comment)
  @UseMiddleware(Auth())
  async createComment(
    @Arg('data') data: CreateCommentInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const newComment = (await prisma.comment.create({
      data: { ...data, authorId: userId! },
      select: { ...select, id: true, post: { select: { authorId: true } } },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${data.postId}`, {
      mutation: CREATED,
      id: newComment.id,
    } as PublishedData)

    pubSub.publish(`${CommentsOnMyPosts}:${newComment.post.authorId}`, {
      mutation: CREATED,
      id: newComment.id,
      authorId: userId,
    } as PublishedData)

    return newComment
  }
}

export { CreateCommentResolver }
