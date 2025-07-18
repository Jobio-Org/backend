import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import {
  IUpdateCompanyUseCase,
  UpdateCompanyInput,
} from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class UpdateCompanyUseCase extends Command<UpdateCompanyInput, Company> implements IUpdateCompanyUseCase {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<Company> {
    const { companyId, ...updateData } = this._input;

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

    return await this.companyRepository.save(updatedCompany);
  }
}
