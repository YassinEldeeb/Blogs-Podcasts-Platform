import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkHeartExistance } from '../shared/checkHeartExists'

@ValidatorConstraint({ async: true })
export class heartExistConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return checkHeartExistance(id)
  }
}

export function HeartExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: heartExistConstraint,
    })
  }
}
