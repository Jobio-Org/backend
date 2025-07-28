import { Builder } from 'builder-pattern';

export class CompanyCategory {
  public readonly id: string;
  public readonly companyId: string;
  public readonly categoryId: string;
  public readonly subCategoryId?: string;
  public readonly createdAt: Date;

  public static builder(companyId: string, categoryId: string) {
    return Builder(CompanyCategory, {
      companyId,
      categoryId,
    });
  }
}
