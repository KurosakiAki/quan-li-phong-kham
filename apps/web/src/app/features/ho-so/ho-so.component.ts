import { Component, OnInit, ViewChild } from '@angular/core';
import { HoSoFormModalComponent } from './ho-so-form-modal/ho-so-form-modal.component';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowLeft, faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faEye } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';
import { HoSoService } from './ho-so.service';
import { SuaHoSoFormModalComponent } from './sua-ho-so-form-modal/sua-ho-so-form-modal.component';

@Component({
  selector: 'ttti-ho-so',
  templateUrl: './ho-so.component.html',
  styleUrls: ['./ho-so.component.scss'],
})
export class HoSoComponent implements OnInit {
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
  hoSo: any;
  hoSoId: any;
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
    private hoSoService: HoSoService,
    private dialog: NgbModal,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.hoSoId = this.authService.currentUser?.roleId;
    this.getUser();

    this.loadLichKhamList();
    this.setParamsListItem();
  }

  getUser = () => {
    this.hoSoService.get(this.hoSoId).subscribe(data => {
      this.hoSo = {
        ...data,
        username: this.authService.currentUser.username
      };
    })
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  loadLichKhamList = () => {
    this.hoSoService.listLichKham(this.hoSoId).subscribe((data: any) => {
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
    const ref = this.dialog.open(HoSoFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { lichKham: lichKham };
  }

  openFormModal(){
    const ref = this.dialog.open(SuaHoSoFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { hoSo: this.hoSo };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.getUser();
        }
    }, () => { })     
  }
}
