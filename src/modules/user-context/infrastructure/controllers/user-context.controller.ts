import { Controller, Get, UseGuards } from '@nestjs/common';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UserContextService } from '~modules/user-context/application/services/user-context.service';

@Controller('auth/user')
@UseGuards(JwtAccessAuthGuard)
export class UserContextController {
  constructor(private readonly userContextService: UserContextService) {}

  @Get('me')
  async getCurrentUser(@UserId() userId: string) {
    return this.userContextService.getUserContext(userId);
  }
}
