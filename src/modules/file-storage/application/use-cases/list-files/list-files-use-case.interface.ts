import { type File } from '../../../domain/entities/file.entity';

export interface ListFilesInput {
  bucket?: string;
}

export type ListFilesOutput = File[];

export interface IListFilesUseCase {
  execute(input: ListFilesInput): Promise<ListFilesOutput>;
}
