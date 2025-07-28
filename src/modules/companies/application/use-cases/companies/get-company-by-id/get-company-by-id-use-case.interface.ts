import { type GetCompanyByIdResponseDto } from '~modules/companies/application/dto/companies/get-company-by-id.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IGetCompanyByIdInput {
  companyId: string;
}

export interface IGetCompanyByIdUseCase extends IUseCase<IGetCompanyByIdInput, GetCompanyByIdResponseDto> {}
