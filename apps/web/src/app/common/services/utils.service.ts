import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor(private datePipe: DatePipe) {}

  /**
   * Chuyển chuỗi ngày ISO thành string theo format tương ứng
   * @param d any
   * @param formatString 'dd/MM/yyyy'
   */
  formatDate(d: string | Date, formatString: string) {
    try {
      return d ? this.datePipe.transform(new Date(d), formatString) : '';
    } catch (err) {
      return '';
    }
  }

  /**
   * parse chuỗi ngày 23/04/2021 -> chuỗi ngày ISO 2021-05-22T14:05:44.716Z
   * @param dateStr
   * @param formatString
   * @returns
   */
  parseDate2ISO(dateStr: string, formatString: string) {
    try {
      let dateParts: any = dateStr.split('/');

      const d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return d.toISOString();
    } catch (err) {
      return '';
    }
  }

  /**
   * Lấy ngày đầu tiên trong tháng của ngày input tương ứng
   * @param d Date()
   * @returns
   */
  getFirstDayOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  /**
   * Lấy ngày cuối trong tháng của ngày input tương ứng
   * @param d Date()
   * @returns
   */
  getEndDayOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  jsDateToSQLDateTime(date: Date) {
    return format(date, 'yyyy-MM-dd hh:mm:ss');
  }

  jsDateToSQLDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }
}
