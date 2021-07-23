import { createMethodDecorator } from 'type-graphql'
import { models } from '../@types/enums/models'
import { prisma } from '../prisma'
import { MyContext } from '../@types/MyContext'

export function IsOwner(model: models) {
  return createMethodDecorator<MyContext>(
    async ({ context: { userId }, args }, next) => {
      const where =
        model !== 'heart'
          ? { id: args.id, authorId: userId }
          : { id: args.id, post: { authorId: userId } }

      const isOwner = !!(
        await (prisma[model] as any).findMany({
          where,
          select: { id: true },
        })
      )[0]

      if (!isOwner) {
        throw new Error(
          `You're not the author of the ${
            model.charAt(0).toUpperCase() + model.slice(1)
          }!`
        )
      }
      return next()
    }
  )
}
