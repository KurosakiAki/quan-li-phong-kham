import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { NhaCungCapFormModalComponent } from './nha-cung-cap-form-modal/nha-cung-cap-form-modal.component';
import { NhaCungCapService } from './nha-cung-cap.service';

@Component({
  selector: 'ttti-nha-cung-cap',
  templateUrl: './nha-cung-cap.component.html',
  styleUrls: ['./nha-cung-cap.component.scss'],
})
export class NhaCungCapComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  nhaCungCapList: any[] = [];
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
    private nhaCungCapService: NhaCungCapService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.loadNhaCungCapList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadNhaCungCapList = () => {
    this.nhaCungCapService.list().subscribe((data: any) => {
        this.nhaCungCapList = data;
        this.editNhaCungCapList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.nhaCungCapList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.nhaCungCapList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.nhaCungCapList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editNhaCungCapList() {
    this.temp = [...this.nhaCungCapList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
      return d.fullname.toLowerCase().indexOf(val) !== -1 || !val ||
      d.phone.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1;
    });
    // update the rows
    this.nhaCungCapList = temp;
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

  openFormModal(nhaCungCap?: any) {
    const ref = this.dialog.open(NhaCungCapFormModalComponent);
    ref.componentInstance.modalParams = { nhaCungCap: nhaCungCap };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadNhaCungCapList();
        }
    }, () => { })
  }

  openComfirmModal(user: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa nhà cung cấp', content: 'Bạn có đồng ý xóa nhà cung cấp này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
            this.nhaCungCapService.remove(user.id).subscribe(res => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadNhaCungCapList();
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            });
        }
    }, () => { })
  }
}
