import { IsUUID } from 'class-validator';

export class CreateRecruiterProfileDto {
  @IsUUID()
  userDetailsId: string;
}
