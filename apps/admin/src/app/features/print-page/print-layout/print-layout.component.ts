import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss'],
})
export class PrintLayoutComponent implements OnInit {
  date: Date = new Date();
  
  constructor() {}

  ngOnInit() {}
}
