import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ScreenSize } from '../../common/services/screen-size.service';
import { HoaDonService } from './hoa-don.service';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';

@Component({
  selector: 'ttti-hoa-don',
  templateUrl: './hoa-don.component.html',
  styleUrls: ['./hoa-don.component.scss'],
})
export class HoaDonComponent implements OnInit {
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
  faCircleCheck = faCircleCheck;

  hoaDonList: any[] = [];
  chiTietHoaDonList: any[] = [];
  temp: any;
  isImporting = false;

  params = {
      limit: 20,
      page: 1
  };

  lastPage = 0;
  tableOffset = 0;

  constructor(
    private translateService: TranslateService,
    private hoaDonService: HoaDonService,
    private cdr: ChangeDetectorRef,
    public dialog: NgbModal,
    public screenSize: ScreenSize,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHoaDonList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadHoaDonList = () => {
    this.hoaDonService.list(this.authService.currentUser.roleId).subscribe((data: any) => {
        this.hoaDonList = data;
        this.editHoaDonList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.hoaDonList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.hoaDonList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.hoaDonList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editHoaDonList() {
    this.hoaDonList.forEach((item) => {
      item.tenKhachHang = item.khachHang?.fullname;
      item.maKhachHang = item.khachHang?.referenceId;
    })
    this.temp = [...this.hoaDonList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.maHoaDon.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.hoaDonList = temp;
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

  openDetail(hoaDon: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { hoaDon: hoaDon };
  }
}
