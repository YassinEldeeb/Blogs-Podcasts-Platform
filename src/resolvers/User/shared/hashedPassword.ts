import { createParamDecorator } from 'type-graphql'
import { MyContext } from '../../../@types/MyContext'
import bcrypt from 'bcryptjs'

function SecureData() {
  return createParamDecorator<MyContext>(({ args }) => {
    const { data } = args

    const hashedPassword = bcrypt.hashSync(
      data.password || data.newPassword,
      10
    )
    const SecureData = { ...data }

    SecureData.password = hashedPassword
    delete SecureData.confirmPassword

    if (SecureData.oldPassword) {
      delete SecureData.newPassword
      delete SecureData.oldPassword
    }

    return SecureData
  })
}

export { SecureData }
