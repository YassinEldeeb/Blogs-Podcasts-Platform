import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

export function IsEqualTo(
  comparisonField: string,
  actualField: string = 'property',
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [actualField],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]

          return value === relatedValue
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `${comparisonField} must match ${relatedPropertyName}`
        },
      },
    })
  }
}
