import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faLock, faPencil, faPlus, faSearch, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { ThuocService } from './thuoc.service';
import { ThuocFormModalComponent } from './thuoc-form-modal/thuoc-form-modal.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-thuoc',
  templateUrl: './thuoc.component.html',
  styleUrls: ['./thuoc.component.scss'],
})
export class ThuocComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  thuocList: any[] = [];
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
    private thuocService: ThuocService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private authService: AuthService
  ) {
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.loadThuocList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadThuocList = () => {
    this.thuocService.list().subscribe((data: any) => {
        this.thuocList = data;
        this.editThuocList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.thuocList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.thuocList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.thuocList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editThuocList() {
    this.temp = [...this.thuocList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.tenThuoc.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.thuocList = temp;
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

  openFormModal(thuoc?: any) {
    const ref = this.dialog.open(ThuocFormModalComponent);
    ref.componentInstance.modalParams = { thuoc: thuoc };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadThuocList();
        }
    }, () => { })
  }

  openComfirmModal(user: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa thuốc', content: 'Bạn có đồng ý xóa thuốc này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
            this.thuocService.remove(user.id).subscribe(res => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadThuocList();
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            });
        }
    }, () => { })
  }
}
