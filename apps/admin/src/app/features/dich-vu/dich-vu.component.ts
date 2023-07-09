import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { DichVuFormModalComponent } from './dich-vu-form-modal/dich-vu-form-modal.component';
import { DichVuService } from './dich-vu.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-dich-vu',
  templateUrl: './dich-vu.component.html',
  styleUrls: ['./dich-vu.component.scss'],
})
export class DichVuComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  dichVuList: any[] = [];
  temp: any;
  isImporting = false;

  params = {
      limit: 20,
      page: 1
  };

  role: any;

  lastPage = 0;
  tableOffset = 0;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private dichVuService: DichVuService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private authService: AuthService
  ) {
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.loadDichVuList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadDichVuList = () => {
    this.dichVuService.list().subscribe((data: any) => {
        this.dichVuList = data;
        this.editDichVuList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.dichVuList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.dichVuList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.dichVuList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editDichVuList() {
    this.temp = [...this.dichVuList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenDichVu.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.dichVuList = temp;
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

  openFormModal(dichVu?: any) {
    const ref = this.dialog.open(DichVuFormModalComponent);
    ref.componentInstance.modalParams = { dichVu: dichVu };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadDichVuList();
        }
    }, () => { })
  }

  openComfirmModal(user: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa dịch vụ', content: 'Bạn có đồng ý xóa dịch vụ này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
            this.dichVuService.remove(user.id).subscribe(res => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadDichVuList();
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            });
        }
    }, () => { })
  }
}
