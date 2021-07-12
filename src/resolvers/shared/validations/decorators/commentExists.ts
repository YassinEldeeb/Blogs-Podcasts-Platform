import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkCommentExistance } from '../shared/checkCommentExists'

@ValidatorConstraint({ async: true })
export class commentExistConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return checkCommentExistance(id)
  }
}

export function CommentExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: commentExistConstraint,
    })
  }
}
