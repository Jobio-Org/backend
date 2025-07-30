import { Inject, Injectable } from '@nestjs/common';

import { CreateCompanyDto } from '~modules/companies/application/dto/companies/create-company.dto';
import { ICreateCompanyUseCase } from '~modules/companies/application/use-cases/companies/create-company/create-company-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';
import { SlugService } from '~shared/infrastructure/services/slug/slug.service';

@Injectable()
export class CreateCompanyUseCase extends Command<CreateCompanyDto, Company> implements ICreateCompanyUseCase {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    private readonly slugService: SlugService,
  ) {
    super();
  }

  protected async implementation(): Promise<Company> {
    const { name, description, website, logo, size, location } = this._input;

    const slug = await this.slugService.generateUniqueSlug(name, (slug) => this.companyRepository.existsBySlug(slug));

    const company = Company.builder(name)
      .slug(slug)
      .description(description)
      .website(website)
      .logo(logo)
      .size(size)
      .location(location)
      .build();

    return await this.companyRepository.create(company);
  }
}
