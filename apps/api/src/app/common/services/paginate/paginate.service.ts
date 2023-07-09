
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginateService {
  constructor() { }

  /**
   * @Example
    async myRequestList(userId: number, query: RequestReportDto) {
      const take = query.limit;
      const page = query.page;
      const skip = (page - 1) * take;

      const whereCondition = `
        ${' requestUserid = ' + userId}
        ${query.code ? " AND code LIKE '" + query.code.toUpperCase() + "%'" : ''}
      `;
      //
      const data = await this.takeoutRequestRepo.findAndCount({
        where: whereCondition,
        take: take,
        skip: skip,
        relations: [
          'requestUser',
          'requestUser.department',
          'requestType',
          'propertyType',
          'approvedStatusInfo',
        ],
        order: { id: 'DESC' },
      });

      return this.paginateService.paginateResponse(data, page, take);
    }

   * @param data
   * @param page
   * @param limit
   * @returns
   *
   */
  paginateResponse<T>(data: [T[], number], page: number, limit: number) {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: result,
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    }
  }
}
