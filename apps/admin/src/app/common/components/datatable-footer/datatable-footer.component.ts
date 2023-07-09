import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { faAnglesRight, faAngleRight, faAnglesLeft, faAngleLeft } from '@fortawesome/pro-solid-svg-icons';

export interface IPageParams {
  limit: number;
  page: number;
};

export interface IFooterChangeEvent {
  limit: number;
  page: number;
};

@Component({
    selector: 'm-datatable-footer',
    templateUrl: 'datatable-footer.component.html'
})

export class MDatatableFooterComponent implements OnInit, OnChanges {
    @Input() params!: IPageParams;
    @Input() totalRows: any;
    lastPage = 0;
    @Output() footerChangeEvent = new EventEmitter<IFooterChangeEvent>();

    faAnglesRight = faAnglesRight;
    faAngleLeft = faAngleLeft;
    faAnglesLeft = faAnglesLeft;
    faAngleRight = faAngleRight;
    constructor() { }

    ngOnInit() {
        if (this.totalRows % this.params.limit > 0 ) {
            this.lastPage = Math.floor(this.totalRows/this.params.limit) + 1;
        } else {
            this.lastPage = Math.floor(this.totalRows/this.params.limit);
        }
    }

    ngOnChanges(changes: any) {
        if (this.totalRows % this.params.limit > 0 ) {
            this.lastPage = Math.floor(this.totalRows/this.params.limit) + 1;
        } else {
            this.lastPage = Math.floor(this.totalRows/this.params.limit);
        }
    }

    onLimitChange(event: any) {
        this.params.limit = parseInt(event.target.value);
        this.params.page = 1;
        this.footerChangeEvent.emit(this.params);
    }

    startPage() {
        this.params.page = 1;
        this.footerChangeEvent.emit(this.params);
    }

    previousPage() {
        this.params.page -= 1;
        this.footerChangeEvent.emit(this.params);
    }

    nextPage() {
        this.params.page +=1;
        this.footerChangeEvent.emit(this.params);
    }

    endPage() {
        this.params.page = this.lastPage;
        this.footerChangeEvent.emit(this.params);
    }
}
