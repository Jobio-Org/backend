import { IsUUID } from 'class-validator';

export class GetUserDetailsByIdDto {
  @IsUUID()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
