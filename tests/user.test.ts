import { sumNums } from '../src/test_playground/sumNums'
import { isValidPassword } from '../src/test_playground/validPassword'

test('should sum two numbers', () => {
  expect(sumNums(2, 5)).toBe(8)
})

test('should reject week password', () => {
  expect(isValidPassword('Hello')).toBeFalsy()
})

test('should reject password that contains the word password', () => {
  expect(isValidPassword('password121314')).toBeFalsy()
})

test('should accept valid password', () => {
  expect(isValidPassword('43120d0qjmj08')).toBeTruthy()
})
