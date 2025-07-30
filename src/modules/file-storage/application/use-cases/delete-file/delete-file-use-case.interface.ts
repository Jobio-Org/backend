import { type DeleteFileDto } from '../../../application/dto/delete-file.dto';

export interface IDeleteFileUseCase {
  execute(input: DeleteFileDto): Promise<void>;
}
