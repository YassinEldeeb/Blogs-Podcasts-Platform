import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkUserExistance } from '../shared/checkUserExists'

@ValidatorConstraint({ async: true })
export class userExistConstraint implements ValidatorConstraintInterface {
  isProblem: boolean
  byEmail: boolean
  constructor(isProblem: boolean, byEmail: boolean) {
    this.isProblem = isProblem
    this.byEmail = byEmail
  }
  validate(authorIdentifier: string) {
    const where = this.byEmail
      ? { email: authorIdentifier }
      : { id: authorIdentifier }

    return checkUserExistance(where, this.isProblem)
  }
}

interface userExistsArg extends ValidationOptions {
  isProblem?: boolean
  byEmail?: boolean
}

export function UserExists(validationOptions?: userExistsArg) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new userExistConstraint(
        validationOptions?.isProblem || false,
        validationOptions?.byEmail || false
      ),
    })
  }
}
