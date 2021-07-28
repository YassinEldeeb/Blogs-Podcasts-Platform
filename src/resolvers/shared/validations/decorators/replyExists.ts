import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkReplyExistance } from '../shared/checkReplyExists'
import { checkUserExistance } from '../shared/checkUserExists'

@ValidatorConstraint({ async: true })
export class replyExistConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return checkReplyExistance(id)
  }
}

export function ReplyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new replyExistConstraint(),
    })
  }
}
