import fs from 'fs'
import nodemailer from 'nodemailer'
import { FROMEMAIL } from './constants/fromEmail'
import { createTransporter } from './utils/transporter'

export const sendBackup = async (
  file: string,
  currentDate: string,
  email: string
) => {
  const transporter = await createTransporter()

  try {
    const info = await transporter.sendMail({
      from: FROMEMAIL,
      to: email,
      subject: `Backup/${currentDate}`,
      attachments: [
        {
          filename: `Backup/${currentDate}.zip`,
          content: fs.createReadStream(file),
        },
      ],
    })

    console.log('Message sent: ', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error)
  }
}
