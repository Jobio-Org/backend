import { Inject, Injectable } from '@nestjs/common';

import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/company-permissions/insufficient-permissions.exception';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permissions/company-permission-query-service.interface';
import {
  IUpdateCompanyUseCase,
  UpdateCompanyInput,
} from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';
import { SlugService } from '~shared/infrastructure/services/slug/slug.service';

@Injectable()
export class UpdateCompanyUseCase extends Command<UpdateCompanyInput, void> implements IUpdateCompanyUseCase {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY)
    private readonly companyCategoryRepository: ICompanyCategoryRepository,
    private readonly slugService: SlugService,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_QUERY_SERVICE)
    private readonly companyPermissionQueryService: ICompanyPermissionQueryService,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { companyId, categories, userId, ...updateData } = this._input;

    const existingCompany = await this.companyRepository.findById(companyId);

    if (!existingCompany) {
      throw new EntityNotFoundException('company', companyId);
    }

    const canEdit = await this.companyPermissionQueryService.canEditCompanyInfo(userId, companyId);

    if (!canEdit) {
      throw new InsufficientPermissionsException();
    }

    let slug = existingCompany.slug;

    if (updateData.name && updateData.name !== existingCompany.name) {
      slug = await this.slugService.generateUniqueSlug(updateData.name, (newSlug) =>
        this.companyRepository.existsBySlug(newSlug),
      );
    }

    const updatedCompany = Company.builder(updateData.name || existingCompany.name)
      .id(existingCompany.id)
      .slug(slug)
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
  }
}
