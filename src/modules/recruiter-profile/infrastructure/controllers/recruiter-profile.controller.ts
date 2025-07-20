import { Body, Controller, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UpdateRecruiterProfileDto } from '~modules/recruiter-profile/application/dto/update-recruiter-profile.dto';
import { IUpdateRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/update-recruiter-profile/update-recruiter-profile-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterOnly } from '~modules/user-context/infrastructure/decorators/recruiter-only.decorator';

@ApiTags('recruiter')
@ApiBearerAuth('JWT-auth')
@Controller('recruiter')
@UseGuards(JwtAccessAuthGuard)
export class RecruiterProfileController {
  constructor(
    @Inject(RecruiterProfileDiToken.UPDATE_RECRUITER_PROFILE_USE_CASE)
    private readonly updateRecruiterProfileUseCase: IUpdateRecruiterProfileUseCase,
  ) {}

  @ApiOperation({
    summary: 'Update recruiter profile',
    description: 'Update the recruiter profile for the authenticated user',
  })
  @RecruiterOnly()
  @Put('profile')
  async updateRecruiterProfile(@Body() updateDto: UpdateRecruiterProfileDto, @UserId() userId: string) {
    return this.updateRecruiterProfileUseCase.execute({
      ...updateDto,
      userId,
    });
  }
}
