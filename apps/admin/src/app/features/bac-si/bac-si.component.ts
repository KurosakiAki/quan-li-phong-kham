import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';
import { BacSiService } from './bac-si.service';

@Component({
  selector: 'ttti-bac-si',
  templateUrl: './bac-si.component.html',
  styleUrls: ['./bac-si.component.scss'],
})
export class BacSiComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;

  bacSiList: any[] = [];
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
    private bacSiService: BacSiService,
    private dialog: NgbModal,
    private cdr: ChangeDetectorRef,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.loadBacSiList();
    this.setParamsListItem();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  loadBacSiList = () => {
    this.bacSiService.list().subscribe((data: any) => {
        this.bacSiList = data;
        this.editBacSiList();
        this.setParamsListItem();
    });
  };

  setParamsListItem() {
    if (this.bacSiList.length % this.params.limit > 0 ) {
        this.lastPage = Math.floor(this.bacSiList.length/this.params.limit) + 1;
    } else {
        this.lastPage = Math.floor(this.bacSiList.length/this.params.limit);
    }
    this.tableOffset = 0;
  }

  editBacSiList() {
    this.bacSiList.forEach((item) => {
      item.tuoi = this.dateToAge(parseISO(item.birthday));
      item.specialistName = item.specialist?.tenChuyenKhoa
    })
    this.temp = [...this.bacSiList];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d: any) => {
        return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.referenceId.toLowerCase().indexOf(val) !== -1 ||
        d.phone.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1;
    });
    // update the rows
    this.bacSiList = temp;
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
