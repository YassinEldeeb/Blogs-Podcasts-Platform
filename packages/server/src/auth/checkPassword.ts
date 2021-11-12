import bcrypt from 'bcryptjs'

export const checkPassword = (
  hashedPassword: string,
  password: string,
  errMessage: string,
) => {
  const isMatch = bcrypt.compareSync(password, hashedPassword)

  if (!isMatch) {
    throw new Error(errMessage)
  }
}
