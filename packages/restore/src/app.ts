import { execute } from '@getvim/execute'
import { s3Bucket } from './aws/config/s3Bucket'
import { bucketName } from './aws/constants/bucket'
import fs from 'fs'

const restore = async () => {
  const data = s3Bucket.getObject(
    {
      Bucket: bucketName,
      Key: 'backup.zip',
    },
    async (err, data) => {
      if (err) console.log(err)

      fs.writeFileSync('backup.zip', data.Body as any)
      const fileNameGzip = 'backup.zip'
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
}

restore()
