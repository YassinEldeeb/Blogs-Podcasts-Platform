import { s3Bucket } from './config/s3Bucket'
import { bucketName } from './constants/bucket'

const deleteImage = (fileName: string) => {
  return s3Bucket.deleteObject({ Bucket: bucketName, Key: fileName }).promise()
}

export { deleteImage }
