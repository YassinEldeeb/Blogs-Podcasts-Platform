import { Auth } from '@middleware/Auth'
import { MyContext } from '@Types/MyContext'
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
import { bucketURL } from '@aws/constants/bucket'
import { deleteImage } from '@aws/deleteImage'

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
    @Ctx() { prisma, userId }: MyContext,
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
      const fileName = profilePic.replace(bucketURL, '')
      await deleteImage(fileName)
    } catch (error) {
      throw new Error("Couldn't delete your profile picture!")
    }

    return { removed: true }
  }
}

export { AddProfilePicResolver }
