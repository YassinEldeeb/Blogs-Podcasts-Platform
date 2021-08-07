import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: 'eu-west-2',
})

const bucketName = 'yassin-devops-images'
const s3Bucket = new AWS.S3({ params: { bucketName } })

export { s3Bucket }
