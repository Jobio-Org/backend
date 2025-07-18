import { type Company } from '~modules/companies/domain/entities/company.entity';

import { type PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { type PaginationResult } from '~shared/application/models/pagination.model';
import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export type IGetCompaniesByRecruiterUseCaseInput = PaginationQueryDto;

export interface IGetCompaniesByRecruiterUseCase
  extends IUseCase<IGetCompaniesByRecruiterUseCaseInput, PaginationResult<Company>> {}
