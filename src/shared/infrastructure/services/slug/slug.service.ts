import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { ISlugService } from '~shared/application/services/slug-service.interface';

@Injectable()
export class SlugService implements ISlugService {
  generateSlug(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  async generateUniqueSlug(text: string, existingSlugs: (slug: string) => Promise<boolean>): Promise<string> {
    const slug = this.generateSlug(text);
    let counter = 1;
    let uniqueSlug = slug;

    while (await existingSlugs(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length > 0 && slug.length <= 255;
  }
}
