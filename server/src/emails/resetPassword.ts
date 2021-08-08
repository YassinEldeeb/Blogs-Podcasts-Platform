import nodemailer from 'nodemailer'
import { v4 } from 'uuid'
import { redisClient } from '@/redis'
import { forgotPasswordPrefix } from '@/resolvers/constants/redisPrefixes'
import { FROMEMAIL } from './constants/fromEmail'
import { createTransporter } from './utils/transporter'

export const resetPasswordEmail = async (userId: string, email: string) => {
  const transporter = await createTransporter()

  try {
    const token = v4()
    console.log(token)
    await redisClient.setex(`${forgotPasswordPrefix}${token}`, 60 * 15, userId)

    const info = await transporter.sendMail({
      from: FROMEMAIL,
      to: email,
      subject: 'Reset Password',
      html: `<span>Your Token is ${token}</span> <br/> 
              <a href='http://frontend.com/reset-password/${token}'>Reset your password</a>`,
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
