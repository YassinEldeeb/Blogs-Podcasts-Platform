import { S3 } from 'aws-sdk'
import { s3Bucket } from './config/s3Bucket'
import { bucketName } from './constants/bucket'

interface uploadBackupArgs {
  buffer: any
}

const uploadBackup = ({ buffer }: uploadBackupArgs) => {
  const data: S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: 'backup.zip',
    Body: buffer,
  }

  return s3Bucket.upload(data).promise()
}

export { uploadBackup }
