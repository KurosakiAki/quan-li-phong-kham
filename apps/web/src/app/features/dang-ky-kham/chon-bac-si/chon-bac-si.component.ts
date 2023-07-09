import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DangKyKhamService } from '../dang-ky-kham.service';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'ttti-chon-bac-si',
  templateUrl: './chon-bac-si.component.html',
  styleUrls: ['./chon-bac-si.component.scss'],
})
export class ChonBacSiComponent implements OnInit {

  faPhone = faPhone;
  faFacebookF = faFacebookF;

  chuyenKhoaList: any;
  bacSiList: any;

  destroy$ = new Subject();

  constructor(
    public lichKhamService: DangKyKhamService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSpecialList();
    this.loadBacSiList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadSpecialList = () => {
    this.lichKhamService.chuyenKhoaList().pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
        this.chuyenKhoaList = data;
    });
  };

  loadBacSiList = () => {
    this.lichKhamService.bacSiList().pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
        this.bacSiList = data;
    });
  };
}
