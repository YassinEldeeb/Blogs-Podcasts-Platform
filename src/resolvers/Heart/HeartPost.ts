import {
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { CREATED, DELETED } from '../../@types/enums/mutationType'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { PublishedDataWithTypes } from '../shared/subscription/PublishedDataWithTypes'
import { PostIdInput } from '../Post/shared/PostIdExists'

@ObjectType()
class HeartPostPayload {
  @Field()
  heart: boolean
}

@Resolver()
class HeartPostResolver {
  @Mutation((_return) => HeartPostPayload)
  @UseMiddleware(Auth())
  async heartPost(
    @Args() { id }: PostIdInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<HeartPostPayload> {
    const hearted = await prisma.heart.findFirst({
      where: { postId: id, authorId: userId },
      select: {
        id: true,
        post: { select: { author: { select: { id: true } } } },
      },
    })

    if (!hearted) {
      const heart = await prisma.heart.create({
        data: { authorId: userId!, postId: id },
        include: { post: { select: { author: { select: { id: true } } } } },
      })

      pubSub.publish(`myPostsHearts:${heart.post.author.id}`, {
        mutation: CREATED,
        id: heart.id,
        type: 'heart',
        authorId: userId,
      } as PublishedDataWithTypes)

      return { heart: true }
    } else {
      await prisma.heart.deleteMany({
        where: { authorId: userId!, postId: id },
      })

      pubSub.publish(`myPostsHearts:${hearted.post.author.id}`, {
        mutation: DELETED,
        id: hearted.id,
        type: 'heart',
        userId,
        deletedHeartId: hearted.id,
      } as PublishedDataWithTypes)

      return { heart: false }
    }
  }
}

export { HeartPostResolver }
