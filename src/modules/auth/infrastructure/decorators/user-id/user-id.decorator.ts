import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { type Request } from 'express';

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user.id;
});
