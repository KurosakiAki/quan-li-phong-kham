import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faPencil, faPlus, faSearch, faTrashAlt, faFileDownload, faSpinner, faCalendars, faCalendarXmark } from '@fortawesome/pro-regular-svg-icons';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';
import { LichKhamService } from './lich-kham.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-lich-kham',
  templateUrl: './lich-kham.component.html',
  styleUrls: ['./lich-kham.component.scss']
})
export class LichKhamComponent implements OnInit {

  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faPlus = faPlus;
  faPencil = faPencil;
  faTrashAlt = faTrashAlt;
  faFileDownload = faFileDownload;
  faSpinner = faSpinner;
  faCalendars = faCalendars;
  faCalendarXmark = faCalendarXmark;

  roleId: any;

  dateFrom: any;
  dateTo: any;
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
    'Chờ xác nhận',
    'Xác nhận',
    'Chờ khám',
    'Đã khám',
    'Hủy bỏ',
    'Quá hạn'
  ]

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private lichKhamService: LichKhamService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private authService: AuthService,
  ) {
    this.dateFrom = new Date();
    this.dateFrom.setHours(0,0,0,0);
    this.dateTo = new Date();
    this.dateTo.setHours(0,0,0,0);
    this.dateTo.setDate(this.dateTo.getDate() + 7);

    this.roleId = authService.currentUser?.roleId;
  }

  ngOnInit(): void {
    this.loadLichKhamList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadLichKhamList = () => {
    this.lichKhamService.list(this.roleId).subscribe((data: any) => {
      data.forEach((item: any) => {
        item.tenBacSi = item.bacSi?.fullname;
      });
      if(this.allDate){
        this.lichKhamList = data;
      }
      else this.lichKhamList = data.filter((val:any) => parseISO(val.thoiGianKham) >= this.dateFrom && parseISO(val.thoiGianKham) <= this.dateTo);
      this.dataCopy = [...data];
      this.temp = [...this.lichKhamList];

      this.setParamsListItem();
      this.resetSearchBar();
    });
  };

  resetSearchBar(){
    this.dateFrom = new Date();
    this.dateFrom.setHours(0,0,0,0);
    this.dateTo = new Date();
    this.dateTo.setHours(0,0,0,0);
    this.dateTo.setDate(this.dateTo.getDate() + 7);

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

  onCheckboxClick(){
    this.allDate = !this.allDate;
    if(this.allDate){
      this.temp = this.dataCopy;
      this.onStatusFilterChange();
    }
    else {
      this.temp = this.dataCopy.filter((val:any) => parseISO(val.thoiGianKham) >= this.dateFrom && parseISO(val.thoiGianKham) <= this.dateTo);
      this.onStatusFilterChange();
    };
  }

  onDateFromSelect(date: NgbDateStruct) {
    this.dateFrom = new Date(date.year, date.month - 1, date.day);
    this.temp = this.dataCopy.filter((val:any) => parseISO(val.thoiGianKham) >= this.dateFrom && parseISO(val.thoiGianKham) <= this.dateTo);
    this.onStatusFilterChange();
  }

  onDateToSelect(date: NgbDateStruct) {
    this.dateTo = new Date(date.year, date.month - 1, date.day);
    this.temp = this.dataCopy.filter((val:any) => parseISO(val.thoiGianKham) >= this.dateFrom && parseISO(val.thoiGianKham) <= this.dateTo);
    this.onStatusFilterChange();
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

  cancelLichKham(lichKham: any){
    this.lichKhamService.update(lichKham.id, {
      ...lichKham,
      trangThai: 'Hủy bỏ'
    }).subscribe((data: any) => {
      this.toastrService.success(this.translateService.instant('Hủy thành công'))
      this.loadLichKhamList();
    }, 
    (err: any) => {
      if (err.error?.message === 'Appointment does not exist'){
        this.toastrService.error(this.translateService.instant('Lịch khám không tồn tại'));
      }
      else this.toastrService.error(err.error?.message);
    });
  }
}
