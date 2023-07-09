import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faLock, faPencil, faPlus, faSearch, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { ChuyenKhoaService } from './chuyen-khoa.service';
import { ChuyenKhoaFormModalComponent } from './chuyen-khoa-form-modal/chuyen-khoa-form-modal.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-chuyen-khoa',
  templateUrl: './chuyen-khoa.component.html',
  styleUrls: ['./chuyen-khoa.component.scss'],
})
export class ChuyenKhoaComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  chuyenKhoaList: any[] = [];
  temp: any;
  isImporting = false;

  params = {
      limit: 20,
      page: 1
  };

  lastPage = 0;
  tableOffset = 0;
  role: any;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private chuyenKhoaService: ChuyenKhoaService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private authService: AuthService,
    ) {
      this.role = authService.role;
    }

  ngOnInit(): void {
    this.loadChuyenKhoaList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadChuyenKhoaList = () => {
    this.chuyenKhoaService.list().subscribe((data: any) => {
        this.chuyenKhoaList = data;
        this.editChuyenKhoaList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.chuyenKhoaList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.chuyenKhoaList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.chuyenKhoaList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editChuyenKhoaList() {
    this.temp = [...this.chuyenKhoaList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenChuyenKhoa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.chuyenKhoaList = temp;
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

  openFormModal(chuyenKhoa?: any) {
    const ref = this.dialog.open(ChuyenKhoaFormModalComponent);
    ref.componentInstance.modalParams = { chuyenKhoa: chuyenKhoa };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadChuyenKhoaList();
        }
    }, () => { })
  }

  openComfirmModal(user: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa chuyên khoa', content: 'Bạn có đồng ý xóa chuyên khoa này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
            this.chuyenKhoaService.remove(user.id).subscribe(res => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadChuyenKhoaList();
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            });
        }
    }, () => { })
  }
}
