import { Body, Controller, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UpdateCandidateProfileDto } from '~modules/candidate-profile/application/dto/update-candidate-profile.dto';
import { IUpdateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/update-candidate-profile/update-candidate-profile-use-case.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';

@ApiTags('candidate')
@ApiBearerAuth('JWT-auth')
@Controller('candidate')
@UseGuards(JwtAccessAuthGuard)
export class CandidateProfileController {
  constructor(
    @Inject(CandidateProfileDiToken.UPDATE_CANDIDATE_PROFILE_USE_CASE)
    private readonly updateCandidateProfileUseCase: IUpdateCandidateProfileUseCase,
  ) {}

  @ApiOperation({
    summary: 'Update candidate profile',
    description: 'Update the candidate profile for the authenticated user',
  })
  @Put('profile')
  async updateCandidateProfile(@Body() updateDto: UpdateCandidateProfileDto, @UserId() userId: string) {
    return this.updateCandidateProfileUseCase.execute({
      ...updateDto,
      userId,
    });
  }
}
