import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faReceipt } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { AuthService } from '../auth/auth.service';
import { PrintService } from '../print-page/print.service';
import { LapHoaDonComponent } from './lap-hoa-don/lap-hoa-don.component';
import { PhieuDichVuFormModalComponent } from './phieu-dich-vu-form-modal/phieu-dich-vu-form-modal.component';
import { PhieuDichVuService } from './phieu-dich-vu.service';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ttti-phieu-dich-vu',
  templateUrl: './phieu-dich-vu.component.html',
  styleUrls: ['./phieu-dich-vu.component.scss'],
})
export class PhieuDichVuComponent implements OnInit {
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

  phieuDichVuList: any[] = [];
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
    private phieuDichVuService: PhieuDichVuService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private printService: PrintService,
    private authService: AuthService
  ) {
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.loadPhieuDichVuList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadPhieuDichVuList = () => {
    this.phieuDichVuService.list().subscribe((data: any) => {
        this.phieuDichVuList = data.filter((item: any) => item.loai !== 'Khám bệnh');
        this.editPhieuDichVuList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.phieuDichVuList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.phieuDichVuList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.phieuDichVuList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editPhieuDichVuList() {
    this.phieuDichVuList.forEach((item) => {
      item.tenBenhNhan = item.lichKham?.tenBenhNhan;
      item.lyDo = item.lichKham?.lyDo;
      item.createdAt = item.lichKham?.createdAt;
    })
    this.temp = [...this.phieuDichVuList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenBenhNhan.toLowerCase().indexOf(val) !== -1 || d.maPhieuDichVu.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.phieuDichVuList = temp;
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

  printPhieuDichVu(phieuDichVu: any){
    this.printService.printDocument('mau-phieu-dich-vu', phieuDichVu.id);
  }

  openFormModal(phieuDichVu?: any) {
    const ref = this.dialog.open(PhieuDichVuFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { phieuDichVu: phieuDichVu };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadPhieuDichVuList();
        }
    }, () => { })
  }

  openComfirmModal(phieuDichVu: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa phiếu dịch vụ', content: 'Bạn có đồng ý xóa phiếu dịch vụ này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
          this.phieuDichVuService.listChiTietPhieuDichVuByPhieuDichVuId(phieuDichVu.id).subscribe((list: any) => {
            const observables = [];

            observables.push(this.phieuDichVuService.remove(phieuDichVu.id))
            for (let item of list){
              observables.push(this.phieuDichVuService.removeChiTiet(item.id));      
            }
        
            forkJoin(observables).subscribe((data: any) => {
              this.toastrService.success(this.translateService.instant('Xóa thành công'))
              this.loadPhieuDichVuList();
            }, (error: any) => {
              this.toastrService.error(this.translateService.instant(error.error?.message));
            })
          })
        }
    }, () => { })
  }

  openDetail(phieuDichVu: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { phieuDichVu: phieuDichVu };
  }

  lapHoaDon(phieuDichVu: any){
    const ref = this.dialog.open(LapHoaDonComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { phieuDichVu: phieuDichVu };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadPhieuDichVuList();
        }
    }, () => { })
  }
}
