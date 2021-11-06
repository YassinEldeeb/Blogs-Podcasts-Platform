import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkUsernameExistance } from '../shared/checkUsernameExists'

@ValidatorConstraint({ async: true })
export class usernameExistConstraint implements ValidatorConstraintInterface {
  validate(username: string, args: any) {
    return checkUsernameExistance(username, !!args.constraints[0])
  }
}

interface usernameExistsArg extends ValidationOptions {
  isProblem?: boolean
}

export function UsernameExists(validationOptions?: usernameExistsArg) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions?.isProblem],
      validator: usernameExistConstraint,
    })
  }
}
