import { UseGuards, applyDecorators } from '@nestjs/common';

import { Roles } from '~modules/user-context/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '~modules/user-context/infrastructure/guards/roles.guard';

import { UserRole } from '~shared/domain/enums/user-role.enum';

export const RecruiterOnly = () => {
  return applyDecorators(Roles(UserRole.RECRUITER), UseGuards(RolesGuard));
};
