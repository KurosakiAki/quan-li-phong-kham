import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faReceipt } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { PrintService } from '../print-page/print.service';
import { PhieuKhamBenhFormModalComponent } from './phieu-kham-benh-form-modal/phieu-kham-benh-form-modal.component';
import { PhieuKhamBenhService } from './phieu-kham-benh.service';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';
import { AuthService } from '../auth/auth.service';
import { LapHoaDonComponent } from './lap-hoa-don/lap-hoa-don.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ttti-phieu-kham-benh',
  templateUrl: './phieu-kham-benh.component.html',
  styleUrls: ['./phieu-kham-benh.component.scss'],
})
export class PhieuKhamBenhComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;
  faPrint = faPrint;
  faEye = faEye;
  faReceipt = faReceipt;

  phieuKhamBenhList: any[] = [];
  temp: any;
  isImporting = false;
  role: any;

  params = {
      limit: 20,
      page: 1
  };

  lastPage = 0;
  tableOffset = 0;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private phieuKhamBenhService: PhieuKhamBenhService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private printService: PrintService,
    private authService: AuthService
  ) {
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.loadPhieuKhamBenhList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadPhieuKhamBenhList = () => {
    this.phieuKhamBenhService.list().subscribe((data: any) => {
        this.phieuKhamBenhList = data.filter((item: any) => item.loai === 'Khám bệnh');
        this.editPhieuKhamBenhList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.phieuKhamBenhList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.phieuKhamBenhList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.phieuKhamBenhList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editPhieuKhamBenhList() {
    this.phieuKhamBenhList.forEach((item) => {
      item.tenBenhNhan = item.lichKham?.tenBenhNhan;
      item.lyDo = item.lichKham?.lyDo;
      item.createdAt = item.lichKham?.createdAt;
    })
    this.temp = [...this.phieuKhamBenhList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenBenhNhan.toLowerCase().indexOf(val) !== -1 || d.maPhieuKhamBenh.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.phieuKhamBenhList = temp;
    if (this.myFilterTable) {
        // Whenever the filter changes, always go back to the first page
        this.myFilterTable.offset = 0;
    }
    this.setParamsListItem();
  }

  footerChangeEvent(event: any) {
    if (this.params.limit != event.limit) {
        this.params.limit = event.limit;
        this.tableOffset = 0;
    } else {
        this.tableOffset = event.page-1;
    }
  }

  printPhieuKhamBenh(phieuKhamBenh: any){
    this.printService.printDocument('mau-phieu-kham-benh', phieuKhamBenh.id);
  }

  openFormModal(phieuKhamBenh?: any) {
    const ref = this.dialog.open(PhieuKhamBenhFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { phieuKhamBenh: phieuKhamBenh };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadPhieuKhamBenhList();
        }
    }, () => { })
  }

  openComfirmModal(phieuKhamBenh: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa phiếu khám bệnh', content: 'Bạn có đồng ý xóa phiếu khám bệnh này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
          this.phieuKhamBenhService.listChiTietPhieuKhamBenhByPhieuKhamBenhId(phieuKhamBenh.id).subscribe((list: any) => {
            const observables = [];

            observables.push(this.phieuKhamBenhService.remove(phieuKhamBenh.id))
            for (let item of list){
              observables.push(this.phieuKhamBenhService.removeChiTiet(item.id));      
            }

            observables.push(this.phieuKhamBenhService.updateLichKham(phieuKhamBenh.lichKhamId, {
              ...phieuKhamBenh.lichKham,
              trangThai: 'Xác nhận'
            }))
        
            forkJoin(observables).subscribe((data: any) => {
              this.toastrService.success(this.translateService.instant('Xóa thành công'))
              this.loadPhieuKhamBenhList();
            }, (error: any) => {
              this.toastrService.error(this.translateService.instant(error.error?.message));
            })
          })
        }
    }, () => { })
  }

  openDetail(phieuKhamBenh: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { phieuKhamBenh: phieuKhamBenh };
  }

  lapHoaDon(phieuKhamBenh: any){
    const ref = this.dialog.open(LapHoaDonComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { phieuKhamBenh: phieuKhamBenh };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadPhieuKhamBenhList();
        }
    }, () => { })
  }
}
