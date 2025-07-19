import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { ContainsNoEmojiValidator } from '~core/validation/domain/validators/contains-no-emoji/contains-no-emoji.validator';
import { AppValidationPipe } from '~core/validation/infrastructure/pipes/app-validation.pipe';

@Module({
  providers: [{ provide: APP_PIPE, useClass: AppValidationPipe }, ContainsNoEmojiValidator],
})
export class ValidationModule {}
