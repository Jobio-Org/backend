import { type UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export type UpdateCompanyInput = UpdateCompanyDto & {
  companyId: string;
  userId: string;
  logoFile?: Express.Multer.File;
};

export interface IUpdateCompanyUseCase extends IUseCase<UpdateCompanyInput, void> {}
