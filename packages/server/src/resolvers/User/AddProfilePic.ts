import { Auth } from '@/middleware/Auth'
import { MyContext } from '@/types/MyContext'
import { Upload } from '@/types/Upload'
import { GraphQLUpload } from 'graphql-upload'
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
import { uploadImage } from '@/aws/uploadImage'
import { deleteImage } from '@/aws/deleteImage'
import { bucketURL } from '@/aws/constants/bucket'

@ObjectType()
class AddProfilePayload {
  @Field()
  uploaded: boolean
}

@Resolver()
class AddProfilePicResolver {
  @Mutation(() => AddProfilePayload)
  @UseMiddleware(Auth())
  async addProfilePic(
    @Arg('picture', () => GraphQLUpload) file: Upload,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<AddProfilePayload> {
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
        const fileName = profilePic.replace(bucketURL, '')
        await deleteImage(fileName)
      } catch (error) {
        throw new Error("Couldn't add profile picture")
      }
    }

    const modifiedFilename = userId + mimetype.replace('image/', '.')

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

    const imageBuffer = await sharp(await getBufferData())
      .resize(250, 250)
      .toBuffer()

    if (imageBuffer.length / Math.pow(1024, 2) > 8) {
      throw new Error('Image is pretty damn Large!')
    }

    const { Location } = await uploadImage({
      fileName: modifiedFilename,
      buffer: imageBuffer,
      mimetype,
      folder: 'profilePics/',
    })

    await prisma.user.update({
      data: { profilePic: Location },
      where: { id: userId },
    })

    return { uploaded: true }
  }
}

export { AddProfilePicResolver }
