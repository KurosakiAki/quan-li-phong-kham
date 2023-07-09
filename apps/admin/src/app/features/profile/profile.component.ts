import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileFormModalComponent } from './profile-form-modal/profile-form-modal.component';
import { faArrowLeft, faSearch, faPlus, faPencil, faLock, faTrashAlt, faWalking, faSpinner, faEye } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ScreenSize } from '../../common/services/screen-size.service';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'ttti-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;
  
  faArrowLeft = faArrowLeft;
  faSearch = faSearch;
  faPlus = faPlus;
  faPencil = faPencil;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faWalking = faWalking;
  faSpinner = faSpinner;
  faEye = faEye;

  profile: any;
  profileId: any;

  role: any;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private profileService: ProfileService,
    private dialog: NgbModal,
    private authService: AuthService,
    public screenSize: ScreenSize
  ) {}

  ngOnInit(): void {
    this.profileId = this.authService.currentUser?.roleId;
    this.role = this.authService.role;

    this.getUser();
  }

  getUser = () => {
    this.profileService.getUserInfo(this.profileId, this.role).subscribe(data => {
      this.profile = {
        ...data,
        userId: this.authService.currentUser.id,
        role: this.role,
        username: this.authService.currentUser.username
      };
    })
  }

  openFormModal(){
    const ref = this.dialog.open(ProfileFormModalComponent, { size: 'lg' });
    ref.componentInstance.modalParams = { profile: this.profile };
    ref.result.then(dataChanged => {
        if (dataChanged) {
          this.getUser();
        }
    }, () => { })     
  }
}
