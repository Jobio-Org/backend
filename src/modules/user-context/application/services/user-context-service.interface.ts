import { type UserContextDto } from '~modules/user-context/application/dto/user-context.dto';

export interface IUserContextService {
  getUserContext(userId: string): Promise<UserContextDto>;
}
