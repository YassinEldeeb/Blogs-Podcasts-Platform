import { setupBucket } from '@devops/common'
import { bucketName } from '../constants/bucket'

const s3Bucket = setupBucket({ bucketName })
export { s3Bucket }
