import { execute } from '@getvim/execute'
import { s3Bucket } from './aws/config/s3Bucket'
import { bucketName } from './aws/constants/bucket'
import fs from 'fs'

s3Bucket.getObject(
  {
    Bucket: bucketName,
    Key: 'backup.zip',
  },
  async (err, data) => {
    if (err) console.log(err)

    const fileNameGzip = 'backup.zip'

    fs.writeFileSync(fileNameGzip, data.Body as any)

    execute(`pg_restore -cC -d ${process.env.DB_NAME} ${fileNameGzip}`)
      .then(async () => {
        fs.unlinkSync('backup.zip')
        console.log('Restored')
      })
      .catch((err) => {
        fs.unlinkSync('backup.zip')
        console.log(err)
      })
  }
)

setTimeout(() => {
  console.log('Waiting')
}, 15000)
