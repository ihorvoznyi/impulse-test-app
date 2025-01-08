import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateUtil } from '../utils/date.util';

@ValidatorConstraint({ async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(dateString: any): boolean {
    if (typeof dateString !== 'string') return false;

    const parsedDate = DateUtil.parse(dateString);
    const isValid = DateUtil.isValid(parsedDate);

    return isValid;
  }

  defaultMessage(): string {
    return 'Date must follow the format "YYYY-MM-DD HH:00:00"';
  }
}

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatConstraint,
    });
  };
}
