import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faReceipt } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { DonThuocFormModalComponent } from './don-thuoc-form-modal/don-thuoc-form-modal.component';
import { DonThuocService } from './don-thuoc.service';
import { PrintService } from '../print-page/print.service';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';
import { LapHoaDonComponent } from './lap-hoa-don/lap-hoa-don.component';
import { forkJoin } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-don-thuoc',
  templateUrl: './don-thuoc.component.html',
  styleUrls: ['./don-thuoc.component.scss'],
})
export class DonThuocComponent implements OnInit {
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

  donThuocList: any[] = [];
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
    private donThuocService: DonThuocService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private printService: PrintService,
    private authService: AuthService
  ) {
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.loadDonThuocList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadDonThuocList = () => {
    this.donThuocService.list().subscribe((data: any) => {
        this.donThuocList = data;
        this.editDonThuocList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.donThuocList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.donThuocList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.donThuocList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editDonThuocList() {
    this.donThuocList.forEach((item) => {
      item.tenBenhNhan = item.lichKham?.tenBenhNhan;
      item.chanDoan = item.lichKham?.chanDoan;
      item.createdAt = item.lichKham?.createdAt;
    })
    this.temp = [...this.donThuocList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenBenhNhan.toLowerCase().indexOf(val) !== -1 || d.maDonThuoc.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.donThuocList = temp;
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

  printDonThuoc(donThuoc: any){
    this.printService.printDocument('mau-don-thuoc', donThuoc.id);
  }

  openFormModal(donThuoc?: any) {
    const ref = this.dialog.open(DonThuocFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { donThuoc: donThuoc };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadDonThuocList();
        }
    }, () => { })
  }

  openComfirmModal(donThuoc: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa đơn thuốc', content: 'Bạn có đồng ý xóa đơn thuốc này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
          this.donThuocService.listChiTietDonThuocByDonThuocId(donThuoc.id).subscribe((list: any) => {
            const observables = [];

            observables.push(this.donThuocService.remove(donThuoc.id))
            for (let item of list){
              observables.push(this.donThuocService.removeChiTiet(item.id));      
            }
        
            forkJoin(observables).subscribe((data: any) => {
              this.toastrService.success(this.translateService.instant('Xóa thành công'))
              this.loadDonThuocList();
            }, (error: any) => {
              this.toastrService.error(this.translateService.instant(error.error?.message));
            })
          })
        }
    }, () => { })
  }

  openDetail(donThuoc: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { donThuoc: donThuoc };
  }

  lapHoaDon(donThuoc: any){
    const ref = this.dialog.open(LapHoaDonComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { donThuoc: donThuoc };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadDonThuocList();
        }
    }, () => { })
  }
}
