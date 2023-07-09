import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';
import { NhanVienService } from './nhan-vien.service';
import { parseISO } from 'date-fns';

@Component({
  selector: 'ttti-nhan-vien',
  templateUrl: './nhan-vien.component.html',
  styleUrls: ['./nhan-vien.component.scss'],
})
export class NhanVienComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  nhanVienList: any[] = [];
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
    private nhanVienService: NhanVienService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.loadNhanVienList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  loadNhanVienList = () => {
    this.nhanVienService.list().subscribe((data: any) => {
        this.nhanVienList = data;
        this.editNhanVienList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.nhanVienList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.nhanVienList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.nhanVienList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editNhanVienList() {
    this.nhanVienList.forEach((item) => {
      item.tuoi = this.dateToAge(parseISO(item.birthday))
    })
    this.temp = [...this.nhanVienList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.referenceId.toLowerCase().indexOf(val) !== -1 ||
        d.phone.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1;
    });
    // update the rows
    this.nhanVienList = temp;
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
