import {
  Arg,
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { models } from '../../@types/enums/models'
import { CREATED, DELETED, UPDATED } from '../../@types/enums/mutationType'
import { Topics } from '../../@types/enums/subscriptions'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { IsOwner } from '../../middleware/IsOwner'
import { Post } from '../../models/Post'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostIdInput } from './shared/PostIdExists'
import { UpdatePostInput } from './updatePost/UpdatePostInput'

@Resolver()
class UpdatePostResolver {
  @Mutation((_returns) => Post)
  @UseMiddleware(Auth())
  @IsOwner(models.post)
  async updatePost(
    @Args() { id }: PostIdInput,
    @Arg('data') data: UpdatePostInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<Post> {
    const originalPost = (await prisma.post.findUnique({
      where: { id },
      select: { published: true },
    })) as any

    const updatedPost = (await prisma.post.update({
      where: { id },
      data,
      select: { ...select, id: true },
    })) as any

    // Publish Data
    if (data.published && originalPost.published === false) {
      pubSub.publish(Topics.Posts, {
        mutation: CREATED,
        id: updatedPost.id,
        authorId: userId,
      } as PublishedData)
    } else if (data.published === false && originalPost.published) {
      // Delete Post Comments
      await prisma.comment.deleteMany({ where: { postId: id } })

      pubSub.publish(Topics.Posts, {
        mutation: DELETED,
        id: updatedPost.id,
        authorId: userId,
        deleted: true,
      } as PublishedData)
    } else {
      pubSub.publish(Topics.Posts, {
        mutation: UPDATED,
        id: updatedPost.id,
        authorId: userId,
      } as PublishedData)
    }

    return updatedPost
  }
}

export { UpdatePostResolver }
