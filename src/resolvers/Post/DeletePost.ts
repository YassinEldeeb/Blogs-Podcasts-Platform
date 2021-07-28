import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { Post } from '@/models/Post'
import { models } from '@/types/enums/models'
import { DELETED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostIdInput } from './shared/PostIdExists'

@Resolver()
class DeletePostResolver {
  @Mutation(() => Post)
  @UseMiddleware(Auth())
  @IsOwner(models.post)
  async deletePost(
    @Args() { postId }: PostIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Post> {
    const ownPost = await prisma.post.findFirst({
      where: { id: postId, authorId: userId },
      select: { id: true, published: true },
    })

    if (!ownPost) {
      throw new Error("You're Not the owner of the Post!")
    }

    const deletedPost = (await prisma.post.delete({
      where: { id: postId },
      select: { ...select },
    })) as any

    // Publish Data
    if (ownPost.published) {
      pubSub.publish(Topics.Posts, {
        mutation: DELETED,
        id: ownPost.id,
        authorId: userId,
        deleted: true,
      } as PublishedData)
    }

    return deletedPost
  }
}

export { DeletePostResolver }
