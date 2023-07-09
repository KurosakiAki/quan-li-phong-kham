import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { PhieuKhamBenhService } from '../phieu-kham-benh.service';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  phieuKhamBenh: any;
  chiTietPhieuKhamBenhList: any;
  khachHang: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private phieuKhamBenhService: PhieuKhamBenhService,
    private translateService: TranslateService
  ) {}

  getChiTietPhieuDichVuList() {
    this.phieuKhamBenhService.listChiTietPhieuKhamBenhByPhieuKhamBenhId(this.phieuKhamBenh.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietPhieuKhamBenhList = list;
    })
  }

  getLichKhamById() {
    this.phieuKhamBenhService.getLichKhamById(this.phieuKhamBenh.lichKhamId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.khachHang = data.khachHang;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.phieuKhamBenh) {
      this.phieuKhamBenh = { ...this.modalParams.phieuKhamBenh };
    }
    
    this.getChiTietPhieuDichVuList();
    this.getLichKhamById();
  }
}
