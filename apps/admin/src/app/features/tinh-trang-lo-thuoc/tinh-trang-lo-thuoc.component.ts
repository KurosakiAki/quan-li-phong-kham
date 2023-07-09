import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TinhTrangLoThuocService } from './tinh-trang-lo-thuoc.service';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';

@Component({
  selector: 'ttti-tinh-trang-lo-thuoc',
  templateUrl: './tinh-trang-lo-thuoc.component.html',
  styleUrls: ['./tinh-trang-lo-thuoc.component.scss'],
})
export class TinhTrangLoThuocComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

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
    private tinhTrangService: TinhTrangLoThuocService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.loadChiTietThuocList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadChiTietThuocList = () => {
    this.tinhTrangService.list().subscribe((data: any) => {
        this.chiTietThuocList = data;
        this.editChiTietThuocList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.chiTietThuocList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.chiTietThuocList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.chiTietThuocList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editChiTietThuocList() {
    this.chiTietThuocList.forEach((item) => {
      item.tenThuoc = item.thuoc?.tenThuoc;;
      item.maNhapKho = item.nhapKhoThuoc?.maNhapKho
    })
    this.temp = [...this.chiTietThuocList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.maNhapKho.toLowerCase().indexOf(val) !== -1 || d.tenThuoc.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.chiTietThuocList = temp;
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
}
