import { Inject, Injectable } from '@nestjs/common';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/companies/company-category.dto';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import {
  IUpdateCompanyUseCase,
  UpdateCompanyInput,
} from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { CompanyWithCategoriesService } from '~modules/companies/infrastructure/services/company-with-categories.service';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class UpdateCompanyUseCase
  extends Command<UpdateCompanyInput, CompanyWithCategoriesDto>
  implements IUpdateCompanyUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY)
    private readonly companyCategoryRepository: ICompanyCategoryRepository,
    private readonly companyWithCategoriesService: CompanyWithCategoriesService,
  ) {
    super();
  }

  protected async implementation(): Promise<CompanyWithCategoriesDto> {
    const { companyId, categories, ...updateData } = this._input;

    const existingCompany = await this.companyRepository.findById(companyId);

    if (!existingCompany) {
      throw new EntityNotFoundException('company', companyId);
    }

    const updatedCompany = Company.builder(updateData.name || existingCompany.name)
      .id(existingCompany.id)
      .description(updateData.description !== undefined ? updateData.description : existingCompany.description)
      .website(updateData.website !== undefined ? updateData.website : existingCompany.website)
      .logo(updateData.logo !== undefined ? updateData.logo : existingCompany.logo)
      .industry(updateData.industry !== undefined ? updateData.industry : existingCompany.industry)
      .size(updateData.size !== undefined ? updateData.size : existingCompany.size)
      .location(updateData.location !== undefined ? updateData.location : existingCompany.location)
      .isActive(existingCompany.isActive)
      .createdAt(existingCompany.createdAt)
      .updatedAt(new Date())
      .build();

    await this.companyRepository.save(updatedCompany);

    if (categories !== undefined) {
      await this.companyCategoryRepository.deleteByCompanyId(companyId);

      if (categories.length > 0) {
        const companyCategories = categories.map((categoryDto) =>
          CompanyCategory.builder(companyId, categoryDto.categoryId).subCategoryId(categoryDto.subCategoryId).build(),
        );

        await this.companyCategoryRepository.bulkInsert(companyCategories);
      }
    }

    return await this.companyWithCategoriesService.getCompanyWithCategories(companyId);
  }
}
