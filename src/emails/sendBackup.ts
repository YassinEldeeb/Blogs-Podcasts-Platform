import nodemailer from 'nodemailer'
import { v4 } from 'uuid'
import { redisClient } from '@/redis'
import { forgotPasswordPrefix } from '@/resolvers/constants/redisPrefixes'
import { FROMEMAIL } from './constants/fromEmail'
import { createTransporter } from './utils/transporter'
import fs from 'fs'

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
      subject: `${currentDate}`,
      attachments: [
        { filename: file, content: fs.createReadStream('file.txt') },
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
