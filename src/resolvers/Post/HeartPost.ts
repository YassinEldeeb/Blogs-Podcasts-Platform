import {
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { PostIdInput } from './shared/PostIdExists'

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
    @Ctx() { prisma, userId }: MyContext
  ): Promise<HeartPostPayload> {
    const hearted = await prisma.heart.findFirst({
      where: { postId: id, userId },
    })

    if (!hearted) {
      await prisma.heart.create({
        data: { userId: userId!, postId: id },
      })
      return { heart: true }
    } else {
      await prisma.heart.deleteMany({
        where: { userId: userId!, postId: id },
      })
      return { heart: false }
    }
  }
}

export { HeartPostResolver }
