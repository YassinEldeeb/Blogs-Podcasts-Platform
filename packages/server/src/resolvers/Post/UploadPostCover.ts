import { bucketURL } from '@/aws/constants/bucket'
import { deleteImage } from '@/aws/deleteImage'
import { uploadImage } from '@/aws/uploadImage'
import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { models } from '@/types/enums/models'
import { MyContext } from '@/types/MyContext'
import { Upload } from '@/types/Upload'
import { GraphQLUpload } from 'graphql-upload'
import sharp from 'sharp'
import streamtToBuffer from 'stream-to-buffer'
import {
  Arg,
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { PostIdInput } from './shared/PostIdExists'

@ObjectType()
class UploadCoverImagePayload {
  @Field()
  uploaded: boolean
}

@Resolver()
class UploadPostCover {
  @Mutation((_type) => UploadCoverImagePayload)
  @UseMiddleware(Auth())
  @IsOwner(models.post)
  async uploadPostCover(
    @Arg('picture', () => GraphQLUpload) file: Upload,
    @Args() { postId }: PostIdInput,
    @Ctx() { prisma }: MyContext
  ): Promise<UploadCoverImagePayload> {
    const { createReadStream, mimetype } = file

    if (!mimetype.includes('image/')) {
      throw new Error('Please provide an Image!')
    }

    const { coverImg } = (await prisma.post.findUnique({
      where: { id: postId },
      select: { coverImg: true },
    })) as any

    // Remove old Image
    if (coverImg) {
      try {
        const fileName = coverImg.replace(bucketURL, '') as string
        await deleteImage(fileName)
      } catch (error) {
        throw new Error("Couldn't add cover image for your post")
      }
    }

    const modifiedFilename = postId + mimetype.replace('image/', '.')

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

    const imageBuffer = await sharp(await getBufferData()).toBuffer()

    if (imageBuffer.length / Math.pow(1024, 2) > 15) {
      throw new Error('Image is pretty damn Large!')
    }

    const { Location } = await uploadImage({
      fileName: modifiedFilename,
      buffer: imageBuffer,
      mimetype,
      folder: 'postsImages/',
    })

    await prisma.post.update({
      data: { coverImg: Location },
      where: { id: postId },
    })

    return { uploaded: true }
  }
}

export { UploadPostCover }
