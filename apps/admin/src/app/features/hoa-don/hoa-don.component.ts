import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faPrint, faEye, faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ConfirmDeleteModalComponent } from '../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { ScreenSize } from '../../common/services/screen-size.service';
import { PrintService } from '../print-page/print.service';
import { HoaDonFormModalComponent } from './hoa-don-form-modal/hoa-don-form-modal.component';
import { HoaDonService } from './hoa-don.service';
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
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private hoaDonService: HoaDonService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize,
    private printService: PrintService,
  ) {}

  ngOnInit(): void {
    this.loadHoaDonList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadHoaDonList = () => {
    this.hoaDonService.list().subscribe((data: any) => {
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
        return d.maHoaDon.toLowerCase().indexOf(val) !== -1 || d.tenKhachHang.toLowerCase().indexOf(val) !== -1
        || d.tenKhachHang.toLowerCase().indexOf(val) !== -1
         || !val;
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

  openFormModal(hoaDon?: any) {
    if (hoaDon?.trangThai != 'Đã thanh toán'){
      const ref = this.dialog.open(HoaDonFormModalComponent, { size: 'xl' });
      ref.componentInstance.modalParams = { hoaDon: hoaDon };
      ref.result.then(dataChanged => {
          if (dataChanged) {
            this.loadHoaDonList();
          }
      }, () => { })      
    }
  }

  openComfirmModal(hoaDon: any) {
    if (hoaDon.trangThai != 'Đã thanh toán'){
      const ref = this.dialog.open(ConfirmDeleteModalComponent);
      ref.componentInstance.modalParams = { title: 'Xóa hóa đơn', content: 'Bạn có đồng ý xóa hóa đơn này?' };
      ref.result.then(deleteUser => {
          if (deleteUser) {
            const start = [];
            start.push(this.hoaDonService.listChiTietHoaDonByHoaDonId(hoaDon.id));
            start.push(this.hoaDonService.getDonThuocByMaHoaDon(hoaDon.maHoaDon));
            start.push(this.hoaDonService.getPhieuDichVuByMaHoaDon(hoaDon.maHoaDon));

            forkJoin(start).subscribe((list: any) => {
              const observables = [];
              console.log(list[0])
              observables.push(this.hoaDonService.remove(hoaDon.id))
              for (let item of list[0]){
                observables.push(this.hoaDonService.removeChiTietHoaDon(item.id));      
              }

              console.log(list[1])

              if (list[1]){
                observables.push(this.hoaDonService.updateDonThuoc(list[1].id, {
                  ...list[1],
                  maHoaDon: ""
                }))
              }

              if (list[2]){
                observables.push(this.hoaDonService.updatePhieuDichVu(list[2].id, {
                  ...list[2],
                  maHoaDon: ""
                }))
              }
          
              forkJoin(observables).subscribe((data: any) => {
                this.toastrService.success(this.translateService.instant('Xóa thành công'))
                this.loadHoaDonList();
              }, (error: any) => {
                this.toastrService.error(this.translateService.instant(error.error?.message));
              })
            })
          }
      }, () => { })
    }
  }

  printPhieuNhapKho(hoaDon: any){
    this.printService.printDocument('mau-hoa-don', hoaDon.id);
  }

  openDetail(hoaDon: any){
    const ref = this.dialog.open(XemChiTietFormModalComponent, { size: 'xl' });
    ref.componentInstance.modalParams = { hoaDon: hoaDon };
  }

  confirmPhieu(hoaDon: any){
    this.hoaDonService.listChiTietHoaDonByHoaDonId(hoaDon.id).subscribe((list: any) => {
        this.chiTietHoaDonList = list;

        const observables = [];
        let index: { index: number; soLuong: any; }[] = [];
        let i = 0;

        observables.push(this.hoaDonService.update(hoaDon.id, {
          ...hoaDon,
          trangThai: 'Đã thanh toán'
        }))
        for (let item of this.chiTietHoaDonList){
          if (item.thuocId){
            if(item.thuoc?.tonKho > item.soLuong){
              observables.push(this.hoaDonService.updateTonKho(item.thuoc?.id, {
                ...item.thuoc,
                tonKho: (parseInt(item.thuoc?.tonKho) - parseInt(item.soLuong))
              }));
  
              observables.push(this.hoaDonService.listChiTietThuocByThuocId(item.thuoc?.id));
  
              index.push({index: i+2, soLuong: item.soLuong});
              
              i = i + 2;
            }
          }
        }
    
        forkJoin(observables).subscribe((data: any) => {
          const observablesCTT = [];
          if (index.length != 0){
            for (let item of index){
              let soLuong = item.soLuong
              for (let val of data[item.index]){
                if (val.soLuongConLai > soLuong){
                  observablesCTT.push(this.hoaDonService.updateChiTietThuoc(val.id, {
                    ...val,
                    soLuongConLai: val.soLuongConLai - item.soLuong
                  }));
                  break;
                }
                else {
                  observablesCTT.push(this.hoaDonService.updateChiTietThuoc(val.id, {
                    ...val,
                    soLuongConLai: 0
                  }))
                  soLuong = soLuong - val.soLuongConLai;
                }
              }
            }
            forkJoin(observablesCTT).subscribe((chiTietThuoc: any) => {
              this.loadHoaDonList();
              this.toastrService.success(this.translateService.instant('Xác nhận thành công'));
            }, (error: any) => {
              this.toastrService.error(this.translateService.instant(error.error?.message));
            })
          }
          else {
              this.loadHoaDonList();
              this.toastrService.success(this.translateService.instant('Xác nhận thành công'));
          }
          
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
    })
    
  }
}
