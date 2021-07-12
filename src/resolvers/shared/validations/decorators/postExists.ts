import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkPostExistance } from '../shared/checkPostExistance'

@ValidatorConstraint({ async: true })
export class postExistConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return checkPostExistance(id)
  }
}

export function PostExists(validationOptions?: ValidationOptions) {
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
