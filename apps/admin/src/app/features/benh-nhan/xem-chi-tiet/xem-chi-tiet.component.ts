import { Component, OnInit, ViewChild } from '@angular/core';
import { XemChiTietFormModalComponent } from '../xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faEye, faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../../common/services/screen-size.service';
import { BenhNhanService } from '../benh-nhan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../common/services/local-storage.service';

@Component({
  selector: 'ttti-xem-chi-tiet',
  templateUrl: './xem-chi-tiet.component.html',
  styleUrls: ['./xem-chi-tiet.component.scss'],
})
export class XemChiTietComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;
  
  faArrowLeft = faArrowLeft;
  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;
  faEye = faEye;

  lichKhamList: any[] = [];
  benhNhan: any;
  benhNhanId: any;
  temp: any;
  isImporting = false;

  params = {
      limit: 20,
      page: 1
  };

  lastPage = 0;
  tableOffset = 0;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private benhNhanService: BenhNhanService,
    private dialog: NgbModal,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private localStorageService: LocalStorageService,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.benhNhanId = this.activatedRoute.snapshot.params['id'];
    this.benhNhanService.get(this.benhNhanId).subscribe(data => {
      this.benhNhan = data;
    })

    this.loadLichKhamList();
    this.setParamsListItem();
  }

  ngOnDestroy(): void {
    this.localStorageService.getUrlFromThenDel();
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  loadLichKhamList = () => {
    this.benhNhanService.listLichKham(this.benhNhanId).subscribe((data: any) => {
        this.lichKhamList = data.filter((item: any) => item.trangThai === 'Đã khám');
        this.editLichKhamList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.lichKhamList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.lichKhamList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.lichKhamList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editLichKhamList() {
    this.lichKhamList.forEach((item) => {
      item.tenBacSi = item.bacSi?.fullname
    })
    this.temp = [...this.lichKhamList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
      return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.referenceId.toLowerCase().indexOf(val) !== -1 ||
      d.phone.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1;
    });
    // update the rows
    this.lichKhamList = temp;
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

  openDetail(lichKham: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { lichKham: lichKham };
  }

  goBack(): void {
    const urlFrom = this.localStorageService.getUrlFromThenDel();
    if (urlFrom) {
      this.route.navigate([urlFrom])
    }
    else this.route.navigate(['/app/benh-nhan']);
  }
}
