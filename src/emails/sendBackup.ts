import nodemailer from 'nodemailer'

export const sendBackup = async (zippedFile: string, date: string) => {
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
    const info = await transporter.sendMail({
      from: 'support@devops.com',
      to: 'backup@devops.com',
      subject: `DB Backup at ${date}`,
      attachments: [{ filename: zippedFile }],
    })

    console.log('Message sent: ', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {}
}
