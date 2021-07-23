// import { execute } from '@getvim/execute'
// import compress from 'gzipme'
// import fs from 'fs'
// import FormData from 'form-data'
// import cron from 'node-cron'
// import { sendBackup } from './emails/sendBackup'

// const username = process.env.PG_USER!
// const database = process.env.DB_NAME!

// let fileName: string
// let fileNameGzip: string
// let currentDate: string

// const genDate = () => {
//   const date = new Date()
//   currentDate = `${date.getFullYear()}-${
//     date.getMonth() + 1
//   }-${date.getDate()},${date.getHours()}:${date.getMinutes()}`

//   fileName = `${currentDate}.tar`
//   fileNameGzip = `${fileName}.tar.gz`
// }

// function backup() {
//   execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`)
//     .then(async () => {
//       await compress(fileName)
//       fs.unlinkSync(fileName)
//       console.log('Backup')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

// function restoreData() {
//   execute(`pg_restore -cC -d ${database} ${fileNameGzip}`)
//     .then(async () => {
//       console.log('Restored')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

// async function sendToBackupEmail(fileName = fileNameGzip) {
//   const form = new FormData()
//   form.append('file', fileName)

//   // Send Backup to mail and unlink the zipped file.
//   await sendBackup(fileName, currentDate)
//   fs.unlinkSync(fileNameGzip)
// }

// function startBackupSchedule() {
//   // cron.schedule(
//   //   '0 */2 * * *',
//   //   () => {
//   //     genDate()
//   //     backup()
//   //     sendToBackupEmail()
//   //   },
//   //   {}
//   // )
//   genDate()
//   backup()
//   sendToBackupEmail()
// }

// export { startBackupSchedule, restoreData }
