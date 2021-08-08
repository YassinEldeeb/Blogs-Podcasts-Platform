export const isValidPassword = (password: string) => {
  return password.length >= 8 && !password.toLowerCase().includes('password')
}
