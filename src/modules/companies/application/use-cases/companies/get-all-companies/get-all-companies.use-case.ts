import { Inject, Injectable } from '@nestjs/common';

import { GetAllCompaniesDto } from '~modules/companies/application/dto/companies/get-all-companies.dto';
import { IGetAllCompaniesUseCase } from '~modules/companies/application/use-cases/companies/get-all-companies/get-all-companies-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import {
  FindAllWithUserCompanyPaginatedInput,
  ICompanyRepository,
} from '~modules/companies/domain/repositories/company-repository.interface';

import { PaginatedQuery } from '~shared/application/CQS/paginated-query.abstract';

@Injectable()
export class GetAllCompaniesUseCase
  extends PaginatedQuery<GetAllCompaniesDto, Company>
  implements IGetAllCompaniesUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {
    super();
  }

  protected async getItems(_input: GetAllCompaniesDto): Promise<Company[]> {
    const repoInput: FindAllWithUserCompanyPaginatedInput = {
      page: _input.page,
      limit: _input.limit,
      name: _input.name,
    };
    const { results } = await this.companyRepository.findAllPaginated(repoInput);
    return results;
  }

  protected async getTotal(_input: GetAllCompaniesDto): Promise<number> {
    if (_input.name) {
      const { total } = await this.companyRepository.findAllPaginated({
        page: _input.page,
        limit: _input.limit,
        name: _input.name,
      });
      return total;
    }
    return this.companyRepository.count();
  }

  protected getBaseUrl(_input: GetAllCompaniesDto): string {
    return '/companies';
  }
}
