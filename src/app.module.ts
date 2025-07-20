import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { CoreModule } from '~core/core.module';

import { AuthModule } from '~modules/auth/auth.module';
import { CandidateProfileModule } from '~modules/candidate-profile/candidate-profile.module';
import { CategoriesModule } from '~modules/categories/categories.module';
import { CompaniesModule } from '~modules/companies/companies.module';
import { EmailModule } from '~modules/email/email.module';
import { RecruiterProfileModule } from '~modules/recruiter-profile/recruiter-profile.module';
import { UserContextModule } from '~modules/user-context/user-context.module';
import { UserDetailsModule } from '~modules/user-details/user-details.module';

import { SharedModule } from '~shared/shared.module';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    UserDetailsModule,
    CandidateProfileModule,
    RecruiterProfileModule,
    UserContextModule,
    CategoriesModule,
    CompaniesModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
