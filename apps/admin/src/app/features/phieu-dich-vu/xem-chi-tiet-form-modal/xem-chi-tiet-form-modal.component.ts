import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { PhieuDichVuService } from '../phieu-dich-vu.service';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  phieuDichVu: any;
  chiTietPhieuDichVuList: any;
  khachHang: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private phieuDichVuService: PhieuDichVuService,
    private translateService: TranslateService
  ) {}

  getChiTietPhieuDichVuList() {
    this.phieuDichVuService.listChiTietPhieuDichVuByPhieuDichVuId(this.phieuDichVu.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietPhieuDichVuList = list;
    })
  }

  getLichKhamById() {
    this.phieuDichVuService.getLichKhamById(this.phieuDichVu.lichKhamId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.khachHang = data.khachHang;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.phieuDichVu) {
      this.phieuDichVu = { ...this.modalParams.phieuDichVu };
    }
    
    this.getChiTietPhieuDichVuList();
    this.getLichKhamById();
  }
}
