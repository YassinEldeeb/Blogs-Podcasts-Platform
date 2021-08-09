import archiver from 'archiver'
import fs from 'fs'
import cron from 'node-cron'
import path from 'path'
import { uploadBackup } from './aws/uploadBackup'

let currentDate: string

const genDate = () => {
  const date = new Date()
  currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}:${date.getMinutes()}`
}

async function saveBackupOnS3(filePath: string) {
  // Send backup to S3
  const readStream = fs.createReadStream(filePath)

  await uploadBackup({ buffer: readStream })
  console.log('UPLOADED TO S3')
}

async function startBackupSchedule() {
  cron.schedule('33 12 * * *', async () => {
    genDate()
    const outputPath = path.join(__dirname, '../target.zip')
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip')

    archive.pipe(output)

    archive.file(path.join(__dirname, '../../../backups/backup-now.sql'), {
      name: `backup-${currentDate}.sql`,
    })

    await archive.finalize()

    saveBackupOnS3(outputPath)
  })
}

startBackupSchedule()
