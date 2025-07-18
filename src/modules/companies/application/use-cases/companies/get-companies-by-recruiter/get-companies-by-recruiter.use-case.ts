import { Inject, Injectable } from '@nestjs/common';

import { GetCompaniesByRecruiterDto } from '~modules/companies/application/dto/companies/get-companies-by-recruiter.dto';
import { IGetCompaniesByRecruiterUseCase } from '~modules/companies/application/use-cases/companies/get-companies-by-recruiter/get-companies-by-recruiter-user-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import {
  FindAllByRecruiterProfileIdPaginatedInput,
  ICompanyRepository,
} from '~modules/companies/domain/repositories/company-repository.interface';

import { PaginatedQuery } from '~shared/application/CQS/paginated-query.abstract';

@Injectable()
export class GetCompaniesByRecruiterUseCase
  extends PaginatedQuery<GetCompaniesByRecruiterDto & { recruiterProfileId: string }, Company>
  implements IGetCompaniesByRecruiterUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {
    super();
  }

  protected async getItems(_input: GetCompaniesByRecruiterDto & { recruiterProfileId: string }): Promise<Company[]> {
    const repoInput: FindAllByRecruiterProfileIdPaginatedInput = {
      recruiterProfileId: _input.recruiterProfileId,
      page: _input.page,
      limit: _input.limit,
      name: _input.name,
    };
    const { results } = await this.companyRepository.findAllByRecruiterProfileIdPaginated(repoInput);
    return results;
  }

  protected async getTotal(_input: GetCompaniesByRecruiterDto & { recruiterProfileId: string }): Promise<number> {
    const repoInput: FindAllByRecruiterProfileIdPaginatedInput = {
      recruiterProfileId: _input.recruiterProfileId,
      name: _input.name,
    };
    const { total } = await this.companyRepository.findAllByRecruiterProfileIdPaginated(repoInput);
    return total;
  }

  protected getBaseUrl(_input: GetCompaniesByRecruiterDto & { recruiterProfileId: string }): string {
    return '/companies/by-recruiter';
  }
}
