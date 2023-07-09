import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faEye } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { BenhNhanFormModalComponent } from './benh-nhan-form-modal/benh-nhan-form-modal.component';
import { BenhNhanService } from './benh-nhan.service';
import { parseISO } from 'date-fns';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';

@Component({
  selector: 'ttti-benh-nhan',
  templateUrl: './benh-nhan.component.html',
  styleUrls: ['./benh-nhan.component.scss'],
})
export class BenhNhanComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;
  faEye = faEye;

  benhNhanList: any[] = [];
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
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.loadBenhNhanList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  loadBenhNhanList = () => {
    this.benhNhanService.list().subscribe((data: any) => {
        this.benhNhanList = data;
        this.editBenhNhanList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.benhNhanList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.benhNhanList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.benhNhanList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editBenhNhanList() {
    this.benhNhanList.forEach((item) => {
      item.tuoi = this.dateToAge(parseISO(item.birthday));
    })
    this.temp = [...this.benhNhanList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
      return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.referenceId.toLowerCase().indexOf(val) !== -1 ||
      d.phone.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1;
    });
    // update the rows
    this.benhNhanList = temp;
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

  openFormModal(benhNhan?: any) {
    const ref = this.dialog.open(BenhNhanFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { benhNhan: benhNhan };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.loadBenhNhanList();
        }
    }, () => { })
  }

  openComfirmModal(user: any) {
    const ref = this.dialog.open(ConfirmDeleteModalComponent);
    ref.componentInstance.modalParams = { title: 'Xóa bệnh nhân', content: 'Bạn có đồng ý xóa bệnh nhân này?' };
    ref.result.then(deleteUser => {
        if (deleteUser) {
            this.benhNhanService.remove(user.id).subscribe(res => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadBenhNhanList();
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            });
        }
    }, () => { })
  }
}
