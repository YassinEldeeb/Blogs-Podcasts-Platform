import { Args, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { models } from '../../@types/enums/models'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { IsOwner } from '../../middleware/IsOwner'
import { SeenInput } from './seen/seenInput'
import { SeenPayload } from './seen/SeenPayload'

@Resolver()
class SeenResolver {
  @Mutation((_returns) => SeenPayload)
  @UseMiddleware(Auth())
  @IsOwner(models.heart)
  heartIsSeen(@Args() { id }: SeenInput, @Ctx() { prisma }: MyContext) {
    return prisma.heart.update({ where: { id }, data: { seen: true } })
  }
}

export { SeenResolver }
