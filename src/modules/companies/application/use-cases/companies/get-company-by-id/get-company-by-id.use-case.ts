import { Inject, Injectable } from '@nestjs/common';

import { GetCompanyByIdResponseDto } from '~modules/companies/application/dto/companies/get-company-by-id.dto';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import {
  IGetCompanyByIdInput,
  IGetCompanyByIdUseCase,
} from '~modules/companies/application/use-cases/companies/get-company-by-id/get-company-by-id-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { CompanyWithCategoriesService } from '~modules/companies/infrastructure/services/company-with-categories.service';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetCompanyByIdUseCase
  extends Query<IGetCompanyByIdInput, GetCompanyByIdResponseDto>
  implements IGetCompanyByIdUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    private readonly companyWithCategoriesService: CompanyWithCategoriesService,
  ) {
    super();
  }

  protected async implementation(): Promise<GetCompanyByIdResponseDto> {
    const { companyId } = this._input;

    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new EntityNotFoundException('company', companyId);
    }

    return await this.companyWithCategoriesService.getCompanyWithCategories(companyId);
  }
}
