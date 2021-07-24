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
import { Topics } from '../../@types/enums/subscriptions'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
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
        post: { select: { id: true, author: { select: { id: true } } } },
      },
    })

    if (!hearted) {
      const heart = await prisma.heart.create({
        data: { authorId: userId!, postId: id },
        include: {
          post: { select: { id: true, author: { select: { id: true } } } },
        },
      })

      pubSub.publish(`${Topics.myPostsHearts}:${heart.post.author.id}`, {
        mutation: CREATED,
        id: heart.id,
        authorId: userId,
      })

      pubSub.publish(`${Topics.HeartsOnPost}:${heart.post.id}`, {
        mutation: CREATED,
        id: heart.id,
        authorId: userId,
      })

      return { heart: true }
    } else {
      await prisma.heart.deleteMany({
        where: { authorId: userId!, postId: id },
      })

      pubSub.publish(`${Topics.myPostsHearts}:${hearted.post.author.id}`, {
        mutation: DELETED,
        id: hearted.id,
        type: 'heart',
        userId,
        deletedHeartId: hearted.id,
      })

      pubSub.publish(`${Topics.HeartsOnPost}:${hearted.post.id}`, {
        mutation: DELETED,
        id: hearted.id,
        authorId: userId,
        deletedHeartId: hearted.id,
      })

      return { heart: false }
    }
  }
}

export { HeartPostResolver }
