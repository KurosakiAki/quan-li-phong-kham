import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DonThuocService } from '../don-thuoc.service';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  donThuoc: any;
  chiTietDonThuocList: any;
  khachHang: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private donThuocService: DonThuocService,
    private translateService: TranslateService
  ) {}

  getChiTietThuocList() {
    this.donThuocService.listChiTietDonThuocByDonThuocId(this.donThuoc.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietDonThuocList = list;
    })
  }

  getLichKhamById() {
    this.donThuocService.getLichKhamById(this.donThuoc.lichKhamId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.khachHang = data.khachHang;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.donThuoc) {
      this.donThuoc = { ...this.modalParams.donThuoc };
    }
    
    this.getChiTietThuocList();
    this.getLichKhamById();
  }
}
