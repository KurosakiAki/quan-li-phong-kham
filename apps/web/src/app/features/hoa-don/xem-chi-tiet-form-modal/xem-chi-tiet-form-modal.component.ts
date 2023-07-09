import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HoaDonService } from '../hoa-don.service';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  hoaDon: any;
  chiTietHoaDonListThuoc: any;
  chiTietHoaDonListDichVu: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private hoaDonService: HoaDonService,
    private translateService: TranslateService
  ) {}

  getChiTietHoaDonList(id: any) {
    this.hoaDonService.listChiTietHoaDonByHoaDonId(this.hoaDon.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietHoaDonListThuoc = list.filter((item: any) => item.thuocId);
        this.chiTietHoaDonListDichVu = list.filter((item: any) => item.dichVuId);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.hoaDon) {
      this.hoaDon = { ...this.modalParams.hoaDon };
    }
    
    this.getChiTietHoaDonList(this.hoaDon.id);
  }
}
