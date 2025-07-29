import { Module } from '@nestjs/common';

import { SlugService } from '~shared/infrastructure/services/slug/slug.service';

@Module({
  providers: [SlugService],
  exports: [SlugService],
})
export class SlugModule {}
