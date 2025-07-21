import { type ValidationOptions, registerDecorator } from 'class-validator';

import { ContainsNoEmojiValidator } from '~core/validation/domain/validators/contains-no-emoji/contains-no-emoji.validator';

export function ContainsNoEmoji(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'containsNoEmoji',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ContainsNoEmojiValidator,
    });
  };
}
