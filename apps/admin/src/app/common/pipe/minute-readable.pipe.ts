import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteReadable',
})
export class MinuteReadablePipe implements PipeTransform {
  transform(value: number): string {
    const hours: number = Math.floor(value / 60);
    return hours + ':' + (value - hours * 60);
  }
}
