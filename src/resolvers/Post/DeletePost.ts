import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { models } from '../../types/enums/models'
import { MutationType } from '../../types/enums/mutationType'
import { Topics } from '../../types/enums/subscriptions'
import { isAuth } from '../../middleware/isAuth'
import { IsOwner } from '../shared/auth/isOwner'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostIdInput } from './shared/PostIdExists'

const { DELETED } = MutationType
const { Posts } = Topics

@Resolver()
class DeletePostResolver {
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  @IsOwner(models.post)
  async deletePost(
    @Args() { id }: PostIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Post> {
    const isOwner = !!(
      await prisma.post.findMany({
        where: { id, authorId: userId },
        select: { id: true },
      })
    )[0]

    if (!isOwner) {
      throw new Error("You're Not the owner of the Post!")
    }

    const deletedPost = (await prisma.post.delete({
      where: { id },
      select: { ...select, id: true },
    })) as any

    // Publish Data
    pubSub.publish(Posts, {
      mutation: DELETED,
      id: deletedPost.id,
    } as PublishedData)

    return deletedPost
  }
}

export { DeletePostResolver }
