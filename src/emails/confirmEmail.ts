import nodemailer from 'nodemailer'
import { v4 } from 'uuid'
import { redisClient } from '../redis'
import { confirmUserPrefix } from '../resolvers/constants/redisPrefixes'
import { FROMEMAIL } from './constants/fromEmail'
import { createTransporter } from './utils/transporter'

export const confirmEmail = async (userId: string, email: string) => {
  const transporter = await createTransporter()

  try {
    const token = v4()
    console.log(token)
    await redisClient.setex(
      `${confirmUserPrefix}${token}`,
      60 * 60 * 24,
      userId
    )

    const info = await transporter.sendMail({
      from: FROMEMAIL,
      to: email,
      subject: 'Confirmation Email',
      html: `<span>Your Token is ${token}</span> <br/> 
              <a href="http://frontend.com/confirmEmail/${token}">Confirm Email</a>`,
    })

    console.log('Message sent: ', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {}
}
