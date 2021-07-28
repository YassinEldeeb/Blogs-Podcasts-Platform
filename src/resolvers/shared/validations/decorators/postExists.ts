import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkPostExistance } from '../shared/checkPostExistance'

@ValidatorConstraint({ async: true })
export class postExistConstraint implements ValidatorConstraintInterface {
  validate(postId: string) {
    return checkPostExistance(postId)
  }
}

interface postExistsArg extends ValidationOptions {
  published?: boolean
}

export function PostExists(validationOptions?: postExistsArg) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: postExistConstraint,
    })
  }
}
