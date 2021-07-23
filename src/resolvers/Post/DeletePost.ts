import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { models } from '../../@types/enums/models'
import { DELETED } from '../../@types/enums/mutationType'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { IsOwner } from '../../middleware/IsOwner'
import { Post } from '../../models/Post'
import { Select } from '../shared/select/selectParamDecorator'
import { PostIdInput } from './shared/PostIdExists'
import { PostPublishedData } from './subscription/postPublished'

@Resolver()
class DeletePostResolver {
  @Mutation(() => Post)
  @UseMiddleware(Auth())
  @IsOwner(models.post)
  async deletePost(
    @Args() { id }: PostIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Post> {
    const isOwner = await prisma.post.findFirst({
      where: { id, authorId: userId },
      select: { id: true },
    })

    if (!isOwner) {
      throw new Error("You're Not the owner of the Post!")
    }

    const deletedPost = (await prisma.post.delete({
      where: { id },
      select: { ...select },
    })) as any

    // Publish Data
    pubSub.publish('Posts', {
      mutation: DELETED,
      id: isOwner.id,
      deletedPostId: isOwner.id,
    } as PostPublishedData)

    return deletedPost
  }
}

export { DeletePostResolver }
