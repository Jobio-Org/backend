import { type GetFileUrlDto } from '~modules/file-storage/application/dto/get-file-url.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IGetFileUrlUseCase extends IUseCase<GetFileUrlDto, string> {
  execute(input: GetFileUrlDto): Promise<string>;
}
