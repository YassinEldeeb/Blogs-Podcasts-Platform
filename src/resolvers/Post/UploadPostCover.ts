import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { models } from '@/types/enums/models'
import { MyContext } from '@/types/MyContext'
import { Upload } from '@/types/Upload'
import fs from 'fs'
import { GraphQLUpload } from 'graphql-upload'
import path from 'path'
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
    @Ctx() { prisma, userId }: MyContext
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
        console.log(coverImg)
        fs.unlinkSync(path.join(__dirname, `../../../uploads${coverImg}`))
      } catch (error) {
        throw new Error("Couldn't add cover image for your post")
      }
    }

    const modifiedFilename = userId + mimetype.replace('image/', '.')

    const writeLocation = path.join(
      __dirname,
      `../../../uploads/posts_images/${modifiedFilename}`
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

    await sharp(await getBufferData()).toFile(writeLocation)

    await prisma.post.update({
      data: { coverImg: `/posts_images/${modifiedFilename}` },
      where: { id: postId },
    })

    return { uploaded: true }
  }
}

export { UploadPostCover }
