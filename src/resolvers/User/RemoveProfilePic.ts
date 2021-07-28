import { Auth } from '@/middleware/Auth'
import { MyContext } from '@/types/MyContext'
import {
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import fs from 'fs'
import path from 'path'

@ObjectType()
class RemoveProfilePayload {
  @Field()
  removed: boolean
}

@Resolver()
class AddProfilePicResolver {
  @Mutation((_type) => RemoveProfilePayload)
  @UseMiddleware(Auth())
  async removeProfilePic(
    @Ctx() { prisma, userId }: MyContext
  ): Promise<RemoveProfilePayload> {
    const { profilePic } = (await prisma.user.findUnique({
      select: { profilePic: true },
      where: { id: userId },
    })) as any

    await prisma.user.update({
      data: { profilePic: null } as any,
      where: { id: userId },
    })

    try {
      fs.unlinkSync(path.join(__dirname, `../../../uploads/${profilePic}`))
    } catch (error) {
      throw new Error('No profile picture to be deleted!')
    }

    return { removed: true }
  }
}

export { AddProfilePicResolver }
