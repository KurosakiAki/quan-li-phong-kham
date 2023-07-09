import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomDatePickerAdapter extends NgbDateAdapter<Date> {
   fromModel(value: string | Date | null): NgbDateStruct | null {
     if (value) {
       const date = new Date(value);
       return {
         day: date.getDate(),
         month: date.getMonth() + 1,
         year: date.getFullYear(),
       };
     }
     return null;
   }
 
   toModel(date: NgbDateStruct | null): Date | null {
     return date ? new Date(date.year, date.month - 1, date.day, 12, 0) : null;
   }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
   readonly DELIMITER = '/';
 
   parse(value: string): NgbDateStruct | null {
     if (value) {
       const date = value.split(this.DELIMITER);
       return {
         day: parseInt(date[0], 10),
         month: parseInt(date[1], 10),
         year: parseInt(date[2], 10),
       };
     }
     return null;
   }
 
   format(date: NgbDateStruct | null): string {
     return date
       ? (date.day < 10 ? '0' + date.day : date.day) +
           this.DELIMITER +
           (date.month < 10 ? '0' + date.month : date.month) +
           this.DELIMITER +
           date.year
       : '';
   }
 }