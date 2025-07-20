import { Module } from '@nestjs/common';

import { CandidateProfileModule } from '~modules/candidate-profile/candidate-profile.module';
import { RecruiterProfileModule } from '~modules/recruiter-profile/recruiter-profile.module';
import { UserContextService } from '~modules/user-context/application/services/user-context.service';
import { UserContextController } from '~modules/user-context/infrastructure/controllers/user-context.controller';
import { UserDetailsModule } from '~modules/user-details/user-details.module';

@Module({
  imports: [UserDetailsModule, CandidateProfileModule, RecruiterProfileModule],
  controllers: [UserContextController],
  providers: [UserContextService],
  exports: [UserContextService],
})
export class UserContextModule {}
