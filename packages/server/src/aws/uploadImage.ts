import { S3 } from 'aws-sdk'
import { s3Bucket } from './config/s3Bucket'
import { bucketName } from './constants/bucket'

interface uploadImageArgs {
  fileName: string
  buffer: any
  mimetype: string
  folder: string
}

const uploadImage = ({
  fileName,
  buffer,
  mimetype,
  folder,
}: uploadImageArgs) => {
  const data: S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: folder + fileName,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: mimetype,
  }

  return s3Bucket.upload(data).promise()
}

export { uploadImage }
