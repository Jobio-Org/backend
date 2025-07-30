import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';

import { DeleteFileDto } from '../../application/dto/delete-file.dto';
import { GetFileUrlDto } from '../../application/dto/get-file-url.dto';
import { ListFilesDto } from '../../application/dto/list-files.dto';
import { UploadFileDto } from '../../application/dto/upload-file.dto';
import { IDeleteFileUseCase } from '../../application/use-cases/delete-file/delete-file-use-case.interface';
import { IGetFileUrlUseCase } from '../../application/use-cases/get-file-url/get-file-url-use-case.interface';
import { IListFilesUseCase } from '../../application/use-cases/list-files/list-files-use-case.interface';
import { IUploadFileUseCase } from '../../application/use-cases/upload-file/upload-file-use-case.interface';
import { FileStorageDiToken } from '../../constants';
import { File } from '../../domain/entities/file.entity';
import { FileMapper } from '../../domain/mappers/file/file.mapper';

class UploadFileRequestDto extends UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: Express.Multer.File;
}

@ApiTags('file-storage')
@Controller('file-storage')
export class FileStorageController {
  constructor(
    @Inject(FileStorageDiToken.UPLOAD_FILE_USE_CASE)
    private readonly uploadFileUseCase: IUploadFileUseCase,
    @Inject(FileStorageDiToken.DELETE_FILE_USE_CASE)
    private readonly deleteFileUseCase: IDeleteFileUseCase,
    @Inject(FileStorageDiToken.GET_FILE_URL_USE_CASE)
    private readonly getFileUrlUseCase: IGetFileUrlUseCase,
    @Inject(FileStorageDiToken.LIST_FILES_USE_CASE)
    private readonly listFilesUseCase: IListFilesUseCase,
  ) {}

  @ApiOperation({
    summary: 'Upload file',
    description: 'Upload a file to Supabase Storage',
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileRequestDto,
    description: 'File upload request',
  })
  @ApiResponse({ type: FileMapper })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() uploadFileDto: UploadFileDto): Promise<File> {
    return await this.uploadFileUseCase.execute({
      ...uploadFileDto,
      file,
    });
  }

  @ApiOperation({
    summary: 'Delete file',
    description: 'Delete a file from storage and database',
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 204, description: 'File deleted successfully' })
  @Delete(':fileId')
  async deleteFile(@Param() params: DeleteFileDto): Promise<void> {
    await this.deleteFileUseCase.execute(params);
  }

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

  @ApiOperation({
    summary: 'List files',
    description: 'Get list of files with optional filtering',
  })
  @ApiResponse({ type: [FileMapper] })
  @Get()
  async listFiles(@Query() query: ListFilesDto): Promise<File[]> {
    return await this.listFilesUseCase.execute(query);
  }
}
