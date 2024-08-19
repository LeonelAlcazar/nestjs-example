import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/types/pagination.type';

@Injectable()
export class UrlUtilsService {
  getPaginationAndCriteriaFromQuery<T>(query: T & Pagination): {
    pagination: Pagination;
    criteria: T;
  } {
    const { page, limit, ...criteria } = query;
    return {
      pagination: {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
      },
      criteria: criteria as T,
    };
  }
}
