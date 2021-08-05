import fs from 'fs'
import { sendBackup } from './emails/sendBackup'
import cron from 'node-cron'
import path from 'path'
import archiver from 'archiver'

const database = process.env.DB_NAME!

let currentDate: string

const genDate = () => {
  const date = new Date()
  currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}/${date.getHours()}:${date.getMinutes()}`
}

// function restoreData() {
//   execute(`pg_restore -cC -d ${database} ${fileNameGzip}`)
//     .then(async () => {
//       console.log('Restored')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

async function sendToBackupEmail(fileName: any) {
  await sendBackup(fileName, currentDate, process.env.GMAIL_EMAIL!)
  fs.unlinkSync(fileName)
}

async function startBackupSchedule() {
  cron.schedule(
    '50 6 * * *',
    () => {
      genDate()
      // sendToBackupEmail()
    },
    {}
  )
  genDate()
  // sendToBackupEmail()
  const outputPath = path.join(__dirname, '../backups/target.zip')
  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip')

  archive.pipe(output)

  archive.file(path.join(__dirname, '../backups/backup-now.sql'), {
    name: `${currentDate}.sql`,
  })

  archive.finalize()
  sendToBackupEmail(outputPath)
}

export { startBackupSchedule }
