import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetFileUrlDto } from '~modules/file-storage/application/dto/get-file-url.dto';
import { IGetFileUrlUseCase } from '~modules/file-storage/application/use-cases/get-file-url/get-file-url-use-case.interface';
import { FileStorageDiToken } from '~modules/file-storage/constants';

@ApiTags('file-storage')
@Controller('file-storage')
export class FileStorageController {
  constructor(
    @Inject(FileStorageDiToken.GET_FILE_URL_USE_CASE)
    private readonly getFileUrlUseCase: IGetFileUrlUseCase,
  ) {}

  @ApiOperation({
    summary: 'Get file URL',
    description: 'Get a signed URL for file access',
  })
  @ApiResponse({ type: String })
  @Get(':fileId/url')
  async getFileUrl(@Param() params: GetFileUrlDto, @Query('expiresIn') expiresIn?: number): Promise<string> {
    return await this.getFileUrlUseCase.execute({
      ...params,
      expiresIn: expiresIn ? parseInt(expiresIn.toString()) : undefined,
    });
  }
}
