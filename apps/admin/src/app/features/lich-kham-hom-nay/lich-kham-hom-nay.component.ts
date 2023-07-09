import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faMemoPad, faPencil, faPlus, faCircleCheck, faFileDownload, faSpinner, faEye, faCalendars, faCalendarXmark, faCheckToSlot, faPrescriptionBottleMedical } from '@fortawesome/pro-regular-svg-icons';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { AuthService } from '../auth/auth.service';
import { UserRoleEnum } from '@api-interfaces';
import { PrintService } from '../print-page/print.service';
import { LichKhamHomNayService } from './lich-kham-hom-nay.service';
import { LapDonThuocFormModalComponent } from './lap-don-thuoc-form-modal/lap-don-thuoc-form-modal.component';
import { KetLuanFormModalComponent } from './ket-luan-form-modal/ket-luan-form-modal.component';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { LapPhieuDichVuComponent } from './lap-phieu-dich-vu/lap-phieu-dich-vu.component';

@Component({
  selector: 'ttti-lich-kham-hom-nay',
  templateUrl: './lich-kham-hom-nay.component.html',
  styleUrls: ['./lich-kham-hom-nay.component.scss'],
})
export class LichKhamHomNayComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faPlus = faPlus;
  faPencil = faPencil;
  faCircleCheck = faCircleCheck;
  faFileDownload = faFileDownload;
  faSpinner = faSpinner;
  faPrescriptionBottleMedical = faPrescriptionBottleMedical;
  faCalendars = faCalendars;
  faCalendarXmark = faCalendarXmark;
  faCheckToSlot = faCheckToSlot;
  faEye = faEye;
  faMemoPad = faMemoPad;

  bacSiId: any;
  role: any;

  current: any;
  statusFilter: any = null;
  searchString: any;

  allDate = false;

  lichKhamList: any[] = [];
  dataCopy: any[] = [];
  temp: any;

  isImporting = false;

  params = {
      limit: 20,
      page: 1
  };

  lastPage = 0;
  tableOffset = 0;

  statusList = [
    'Xác nhận',
    'Chờ khám',
    'Đã khám'
  ]

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private lichKhamService: LichKhamHomNayService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private authService: AuthService,
    private printService: PrintService,
    private localStorageService: LocalStorageService
  ) {
    this.bacSiId = authService.currentUser?.roleId;
    this.current = new Date();
  }

  ngOnInit(): void {
    this.loadLichKhamList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadLichKhamList = () => {
    this.lichKhamService.list(this.bacSiId).subscribe((data: any) => {
      data.forEach((item: any) => {
        item.tenBacSi = item.bacSi?.fullname;
      });
      this.lichKhamList = data.filter((val:any) => parseISO(val.thoiGianKham).toDateString() === this.current.toDateString());
      this.temp = [...this.lichKhamList];

      this.setParamsListItem();
      this.resetSearchBar();
    });
  };

  resetSearchBar(){

    this.statusFilter = null;
    this.searchString = null;
  }

  setParamsListItem() {
    if (this.lichKhamList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.lichKhamList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.lichKhamList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  footerChangeEvent(event: any) {
    if (this.params.limit != event.limit) {
        this.params.limit = event.limit;
        this.tableOffset = 0;
    } else {
        this.tableOffset = event.page-1;
    }
  }

  filterSearch(val: any){
    if(this.statusFilter != null){
      return this.temp.filter((d: any) => {
        return (d.tenBenhNhan.toLowerCase().indexOf(val) !== -1 || 
          d.soDienThoai.toLowerCase().indexOf(val) !== -1 || !val)
          && d.trangThai === this.statusFilter;
      });
    }
    else {
      return this.temp.filter((d: any) => {
        return d.tenBenhNhan.toLowerCase().indexOf(val) !== -1 || d.soDienThoai.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onStatusFilterChange(){
    let temp;
    if (!this.searchString){
      if (this.statusFilter){
        temp = this.temp.filter((d: any) => {
          return d.trangThai === this.statusFilter;
        });
      }
      else temp = this.temp
    }
    else temp = this.filterSearch(this.searchString.toLowerCase());

    // update the rows
    this.lichKhamList = temp;
    if (this.myFilterTable) {
        // Whenever the filter changes, always go back to the first page
        this.myFilterTable.offset = 0;
    }
    this.setParamsListItem();
  }

  updateFilter() {
    const val = this.searchString.toLowerCase();
    // filter our data
    const temp = this.filterSearch(val);
    // update the rows
    this.lichKhamList = temp;
    if (this.myFilterTable) {
        // Whenever the filter changes, always go back to the first page
        this.myFilterTable.offset = 0;
    }
    this.setParamsListItem();
  }

  completeLichKham(lichKham: any){
    const ref = this.dialog.open(KetLuanFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { lichKham: lichKham };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadLichKhamList();
        }
    }, () => { })
  }

  toggleExpandRow(row: any){
    this.myFilterTable.rowDetail.toggleExpandRow(row);
  }

  createDonThuoc(lichKham: any){
    const ref = this.dialog.open(LapDonThuocFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { lichKham: lichKham };
    
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadLichKhamList();
        }
    }, () => { })
  }

  createPhieuDichVu(lichKham: any){
    const ref = this.dialog.open(LapPhieuDichVuComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { lichKham: lichKham };
    
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadLichKhamList();
        }
    }, () => { })
  }

  onClick(){
    this.localStorageService.setUrlFrom('app/lich-kham-hom-nay')
  }
}
