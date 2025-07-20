import { IsUUID } from 'class-validator';

export class CreateCandidateProfileDto {
  @IsUUID()
  userDetailsId: string;
}
