import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { POSTGRES_DB } from '~lib/drizzle-postgres';

import { File as FileEntity } from '~modules/file-storage/domain/entities/file.entity';
import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';
import { FileMapper, IFileDataAccess } from '~modules/file-storage/domain/mappers/file/file.mapper';
import { IFileRepository } from '~modules/file-storage/domain/repositories/file-repository.interface';

import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { files } from '~shared/infrastructure/database/drizzle/schema/public-database-schema';

@Injectable()
export class DrizzleFileRepository
  extends DrizzleRepository<FileEntity, TableDefinition<typeof files>, IFileDataAccess>
  implements IFileRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(FileMapper) mapper: IDataAccessMapper<FileEntity, IFileDataAccess>,
  ) {
    super(TableDefinition.create(files, 'id'), db, mapper);
  }

  async create(file: FileEntity): Promise<FileEntity> {
    const data = this.mapper.toPersistence(file);
    const [createdFile] = await this.db.insert(files).values(data).returning();
    return this.mapper.toDomain(createdFile);
  }

  async findById(id: string): Promise<FileEntity | null> {
    const result = await this.db.select().from(files).where(eq(files.id, id)).limit(1);
    return result.length > 0 ? this.mapper.toDomain(result[0]) : null;
  }

  async findByPath(path: string): Promise<FileEntity | null> {
    const result = await this.db.select().from(files).where(eq(files.path, path)).limit(1);
    return result.length > 0 ? this.mapper.toDomain(result[0]) : null;
  }

  async findByBucket(bucket: FileBucket): Promise<FileEntity[]> {
    const result = await this.db.select().from(files).where(eq(files.bucket, bucket));
    return result.map((file) => this.mapper.toDomain(file));
  }

  async findAll(): Promise<FileEntity[]> {
    const result = await this.db.select().from(files);
    return result.map((file) => this.mapper.toDomain(file));
  }

  async update(file: FileEntity): Promise<FileEntity> {
    const data = this.mapper.toPersistence(file);
    const [updatedFile] = await this.db
      .update(files)
      .set({
        name: data.name,
        originalName: data.originalName,
        path: data.path,
        mimeType: data.mimeType,
        type: data.type,
        bucket: data.bucket,
        url: data.url,
        updatedAt: new Date(),
      } as any)
      .where(eq(files.id, file.id))
      .returning();
    return this.mapper.toDomain(updatedFile);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(files).where(eq(files.id, id));
  }

  async existsByPath(path: string): Promise<boolean> {
    const result = await this.db.select().from(files).where(eq(files.path, path)).limit(1);
    return result.length > 0;
  }
}
