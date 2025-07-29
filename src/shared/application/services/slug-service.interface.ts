export interface ISlugService {
  generateSlug(text: string): string;
  generateUniqueSlug(text: string, existingSlugs: (slug: string) => Promise<boolean>): Promise<string>;
  isValidSlug(slug: string): boolean;
}
