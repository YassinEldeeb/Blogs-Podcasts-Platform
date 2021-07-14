import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { MutationType } from '../../types/enums/mutationType'
import { Topics } from '../../types/enums/subscriptions'
import { isAuth } from '../../middleware/isAuth'
import { Comment } from '../../models/Comment'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CreateCommentInput } from './createComment/CreateCommentInput'

const { CREATED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class CreateCommentResolver {
  @Mutation((_returns) => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('data') data: CreateCommentInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const newComment = (await prisma.comment.create({
      data: { ...data, authorId: userId! },
      select: { ...select, id: true },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${data.postId}`, {
      mutation: CREATED,
      id: newComment.id,
    } as PublishedData)

    return newComment
  }
}

export { CreateCommentResolver }
