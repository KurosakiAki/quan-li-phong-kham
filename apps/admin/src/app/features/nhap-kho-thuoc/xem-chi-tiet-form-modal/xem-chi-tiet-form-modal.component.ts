import { Component, Input, OnInit } from '@angular/core';
import { NhapKhoThuocService } from '../nhap-kho-thuoc.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  nhapKhoThuoc: any;
  chiTietThuocList: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private nhapKhoThuocService: NhapKhoThuocService,
    private translateService: TranslateService
  ) {}

  getChiTietThuocList(id: any) {
    this.nhapKhoThuocService.listChiTietThuocByNhapKhoThuocId(this.nhapKhoThuoc.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietThuocList = list;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.nhapKhoThuoc) {
      this.nhapKhoThuoc = { ...this.modalParams.nhapKhoThuoc };
    }
    
    this.getChiTietThuocList(this.nhapKhoThuoc.id);
    console.log(this.nhapKhoThuoc)
  }
}
