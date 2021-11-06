import { bucketName } from '../constants/bucket'
import { setupBucket } from '../utils/setupBucket'

const s3Bucket = setupBucket({ bucketName })
export { s3Bucket }
