import fs from 'fs'
import cron from 'node-cron'
import path from 'path'
import archiver from 'archiver'

let currentDate: string

const genDate = () => {
  const date = new Date()
  currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}/${date.getHours()}:${date.getMinutes()}`
}

async function saveBackupOnS3(fileName: string) {
  // Send backup to S3
  setTimeout(() => {
    fs.unlinkSync(fileName)
  }, 2000)
}

async function startBackupSchedule(): Promise<void> {
  cron.schedule(
    '6 12 * * *',
    () => {
      genDate()
      const outputPath = path.join(__dirname, '../target.zip')
      const output = fs.createWriteStream(outputPath)
      const archive = archiver('zip')

      archive.pipe(output)

      archive.file(path.join(__dirname, '../backups/backup-now.sql'), {
        name: `${currentDate}.sql`,
      })

      archive.finalize()
      setTimeout(() => {
        saveBackupOnS3(outputPath)
      }, 2000)
    },
    {}
  )
}

startBackupSchedule()
