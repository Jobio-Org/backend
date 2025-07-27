import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UserContextService } from '~modules/user-context/application/services/user-context.service';

@Controller('auth')
@UseGuards(JwtAccessAuthGuard)
export class UserContextController {
  constructor(private readonly userContextService: UserContextService) {}

  @Get('/user/me')
  @ApiBearerAuth('JWT-auth')
  async getCurrentUser(@UserId() userId: string) {
    return this.userContextService.getUserContext(userId);
  }
}
