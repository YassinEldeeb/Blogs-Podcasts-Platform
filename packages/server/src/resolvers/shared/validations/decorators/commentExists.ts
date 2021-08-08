import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { checkCommentExistance } from '../shared/checkCommentExists'

@ValidatorConstraint({ async: true })
export class commentExistConstraint implements ValidatorConstraintInterface {
  validate(id: string, args: any) {
    return checkCommentExistance(
      id,
      args.constraints[0] ? args.object.postId : undefined
    )
  }
}

interface commentExistsArg extends ValidationOptions {
  existsWithinThisPost?: boolean
}

export function CommentExists(validationOptions?: commentExistsArg) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions?.existsWithinThisPost],
      validator: commentExistConstraint,
    })
  }
}
