import { Auth } from '@/middleware/Auth'
import { MyContext } from '@/types/MyContext'
import { Upload } from '@/types/Upload'
import { GraphQLUpload } from 'graphql-upload'
import path from 'path'
import sharp from 'sharp'
import streamtToBuffer from 'stream-to-buffer'
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import fs from 'fs'

@ObjectType()
class AddProfilePayload {
  @Field()
  uploaded: boolean
}

@Resolver()
class AddProfilePicResolver {
  @Mutation((_type) => AddProfilePayload)
  @UseMiddleware(Auth())
  async addProfilePic(
    @Arg('picture', () => GraphQLUpload) file: Upload,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<AddProfilePayload> {
    console.log('Begining!!')
    const { createReadStream, mimetype } = file

    if (!mimetype.includes('image/')) {
      throw new Error('Please provide an Image!')
    }

    const { profilePic } = (await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePic: true },
    })) as any

    // Remove old Image
    if (profilePic) {
      try {
        console.log(profilePic)
        fs.unlinkSync(path.join(__dirname, `../../../uploads${profilePic}`))
      } catch (error) {
        throw new Error("Couldn't add profile picture")
      }
    }

    const modifiedFilename = userId + mimetype.replace('image/', '.')

    const writeLocation = path.join(
      __dirname,
      `../../../uploads/profile_images/${modifiedFilename}`
    )

    const stream = createReadStream()

    const getBufferData = (): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        streamtToBuffer(stream, async (err: any, buffer: Buffer) => {
          if (err) {
            reject(err)
          }
          resolve(buffer)
        })
      })
    }

    console.log('Saving Picture...')

    await sharp(await getBufferData())
      .resize(250, 250)
      .toFile(writeLocation)

    await prisma.user.update({
      data: { profilePic: `/profile_images/${modifiedFilename}` },
      where: { id: userId },
    })

    return { uploaded: true }
  }
}

export { AddProfilePicResolver }
