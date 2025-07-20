import { Global, Module } from '@nestjs/common';

import { CandidateProfileModule } from '~modules/candidate-profile/candidate-profile.module';
import { RecruiterProfileModule } from '~modules/recruiter-profile/recruiter-profile.module';
import { UserContextService } from '~modules/user-context/application/services/user-context.service';
import { UserContextController } from '~modules/user-context/infrastructure/controllers/user-context.controller';
import { RolesGuard } from '~modules/user-context/infrastructure/guards/roles.guard';
import { UserDetailsModule } from '~modules/user-details/user-details.module';

@Global()
@Module({
  imports: [UserDetailsModule, CandidateProfileModule, RecruiterProfileModule],
  controllers: [UserContextController],
  providers: [UserContextService, RolesGuard],
  exports: [UserContextService, RolesGuard],
})
export class UserContextModule {}
