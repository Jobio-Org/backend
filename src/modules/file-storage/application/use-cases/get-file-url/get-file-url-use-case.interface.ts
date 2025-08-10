import { type GetFileUrlDto } from '../../../application/dto/get-file-url.dto';

export interface IGetFileUrlUseCase {
  execute(input: GetFileUrlDto): Promise<string>;
}
