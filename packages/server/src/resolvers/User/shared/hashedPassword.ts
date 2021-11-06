import { createParamDecorator } from 'type-graphql'
import { MyContext } from '@/types/MyContext'
import bcrypt from 'bcryptjs'

function SecureData() {
  return createParamDecorator<MyContext>(({ args }) => {
    const { data } = args
    const SecureData = { ...data }

    if (data.password || data.newPassword) {
      const hashedPassword = bcrypt.hashSync(
        data.password || data.newPassword,
        10
      )

      SecureData.password = hashedPassword
      delete SecureData.confirmPassword

      if (SecureData.oldPassword) {
        delete SecureData.newPassword
        delete SecureData.oldPassword
      }
    }
    SecureData.email = (data.email as string).toLowerCase()
    return SecureData
  })
}

export { SecureData }
