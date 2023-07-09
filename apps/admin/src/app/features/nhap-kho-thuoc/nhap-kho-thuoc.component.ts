import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { NhapKhoThuocService } from './nhap-kho-thuoc.service';
import { NhapKhoThuocFormModalComponent } from './nhap-kho-thuoc-form-modal/nhap-kho-thuoc-form-modal.component';
import { PrintService } from '../print-page/print.service';
import { XemChiTietFormModalComponent } from './xem-chi-tiet-form-modal/xem-chi-tiet-form-modal.component';
import { forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'ttti-nhap-kho-thuoc',
  templateUrl: './nhap-kho-thuoc.component.html',
  styleUrls: ['./nhap-kho-thuoc.component.scss'],
})
export class NhapKhoThuocComponent implements OnInit {
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

  nhapKhoThuocList: any[] = [];
  chiTietThuocList: any[] = [];
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
    private nhapKhoThuocService: NhapKhoThuocService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private printService: PrintService,
  ) {}

  ngOnInit(): void {
    this.loadNhapKhoThuocList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadNhapKhoThuocList = () => {
    this.nhapKhoThuocService.list().subscribe((data: any) => {
        this.nhapKhoThuocList = data;
        this.editNhapKhoThuocList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.nhapKhoThuocList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.nhapKhoThuocList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.nhapKhoThuocList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editNhapKhoThuocList() {
    this.nhapKhoThuocList.forEach((item) => {
      item.tenNhaCungCap = item.nhaCungCap?.fullname;
    })
    this.temp = [...this.nhapKhoThuocList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.maNhapKho.toLowerCase().indexOf(val) !== -1 || d.tenNhaCungCap.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.nhapKhoThuocList = temp;
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

  openFormModal(nhapKhoThuoc?: any) {
    if (nhapKhoThuoc?.trangThai != 'Đã thanh toán'){
      const ref = this.dialog.open(NhapKhoThuocFormModalComponent, { size: 'xl' });
      ref.componentInstance.modalParams = { nhapKhoThuoc: nhapKhoThuoc };
      ref.result.then(dataChanged => {
          if (dataChanged) {
            this.loadNhapKhoThuocList();
          }
      }, () => { })      
    }
  }

  openComfirmModal(nhapKho: any) {
    if (nhapKho.trangThai != 'Đã thanh toán'){
      const ref = this.dialog.open(ConfirmDeleteModalComponent);
      ref.componentInstance.modalParams = { title: 'Xóa phiếu nhập kho', content: 'Bạn có đồng ý xóa phiếu nhập kho này?' };
      ref.result.then(deleteUser => {
          if (deleteUser) {
            this.nhapKhoThuocService.listChiTietThuocByNhapKhoThuocId(nhapKho.id).subscribe((list: any) => {
              const observables = [];

              observables.push(this.nhapKhoThuocService.remove(nhapKho.id))
              for (let item of list){
                observables.push(this.nhapKhoThuocService.removeChiTietThuoc(item.id));      
              }
          
              forkJoin(observables).subscribe((data: any) => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadNhapKhoThuocList();
              }, (error: any) => {
                this.toastrService.error(this.translateService.instant(error.error?.message));
              })
            })
          }
      }, () => { })
    }
  }

  printPhieuNhapKho(nhapKho: any){
    this.printService.printDocument('mau-nhap-kho', nhapKho.id);
  }

  openDetail(nhapKhoThuoc: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { nhapKhoThuoc: nhapKhoThuoc };
  }

  confirmPhieu(nhapKhoThuoc: any){
    this.nhapKhoThuocService.listChiTietThuocByNhapKhoThuocId(nhapKhoThuoc.id).subscribe((list: any) => {
        this.chiTietThuocList = list;

        const observables = [];

        observables.push(this.nhapKhoThuocService.update(nhapKhoThuoc.id, {
          ...nhapKhoThuoc,
          trangThai: 'Đã thanh toán'
        }))
        for (let item of this.chiTietThuocList){
          observables.push(this.nhapKhoThuocService.updateTonKho(item.thuoc?.id, {
            ...item.thuoc,
            tonKho: (parseInt(item.thuoc?.tonKho) + parseInt(item.soLuong))
          }));   
          
          observables.push(this.nhapKhoThuocService.updateChiTietThuoc(item.id, {
            ...item,
            trangThai: 'Đã thanh toán'
          }))
        }
    
        forkJoin(observables).subscribe((data: any) => {
          this.loadNhapKhoThuocList();
          this.toastrService.success(this.translateService.instant('Xác nhận thành công'));
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
    })
    
  }
}
