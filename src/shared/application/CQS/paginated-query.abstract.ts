import { Inject } from '@nestjs/common';

import { Query } from '~shared/application/CQS/query.abstract';
import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { PaginationResult } from '~shared/application/models/pagination.model';
import { IPaginationService } from '~shared/application/services/pagination-service.interface';
import { BaseToken } from '~shared/constants';

export abstract class PaginatedQuery<TInput extends PaginationQueryDto, TOutput> extends Query<
  TInput,
  PaginationResult<TOutput>
> {
  @Inject(BaseToken.PAGINATION_SERVICE)
  protected paginationService: IPaginationService;

  protected abstract getItems(input: TInput): Promise<TOutput[]>;
  protected abstract getTotal(input: TInput): Promise<number>;
  protected abstract getBaseUrl(input: TInput): string;

  protected async implementation(): Promise<PaginationResult<TOutput>> {
    const [items, total] = await Promise.all([this.getItems(this._input), this.getTotal(this._input)]);

    const baseUrl = this.getBaseUrl(this._input);

    return this.paginationService.paginate(items, total, this._input, baseUrl);
  }
}
