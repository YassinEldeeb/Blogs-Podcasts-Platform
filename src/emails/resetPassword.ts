import nodemailer from 'nodemailer'
import { v4 } from 'uuid'
import { redisClient } from '../redis'
import { forgotPasswordPrefix } from '../resolvers/constants/redisPrefixes'

export const resetPasswordEmail = async (userId: string, email: string) => {
  const testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  try {
    const token = v4()
    console.log(token)
    await redisClient.setex(`${forgotPasswordPrefix}${token}`, 60 * 15, userId)

    const info = await transporter.sendMail({
      from: 'support@devops.com',
      to: email,
      subject: 'Reset Password',
      html: `<a>http://frontend.com/reset-password/${token}</a>`,
    })

    console.log('Message sent: ', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {}
}
