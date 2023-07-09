import { Component, OnInit } from '@angular/core';
import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { faShuffle } from '@fortawesome/pro-light-svg-icons';
import { LayoutService } from '../layout.service';
import { AppTranslateService } from '../../services/app-translate.service';
import { AppState } from '../../services/app-state.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'm-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    faBars = faBars;
    faTimes = faTimes;
    faShuffle  = faShuffle ;

    isScrolling = false;

    showMobileMenu = false;
    constructor(
        public layoutService: LayoutService,
        public translateService: AppTranslateService,
        public appState: AppState,
        private store: Store
    ) { }

    ngOnInit() {
        window.addEventListener('scroll', this.scroll, true)
    }

    scroll = (): void => {

        let scrollHeigth;
     
        if(window.innerWidth < 350){
         scrollHeigth = 30;
        }else if(window.innerWidth < 500 && window.innerWidth > 350){
         scrollHeigth = 40;
        }else if(window.innerWidth < 700 && window.innerWidth > 500){
         scrollHeigth = 50;
        }else if(window.innerWidth < 1000 && window.innerWidth > 700){
         scrollHeigth = 30;
        }else{
          scrollHeigth = 30;
        }
         if(window.scrollY >= scrollHeigth){
            this.isScrolling = true;
            document.body.style.setProperty('--navbar-scroll', "white");
            document.body.style.setProperty('--navbar-scroll-shadow', "0px 6px 10px -5px #000000");
         }else if(window.scrollY < scrollHeigth){
            this.isScrolling = false;
            document.body.style.setProperty('--navbar-scroll', "transparent");
            document.body.style.setProperty('--navbar-scroll-shadow', "none");
         }
    }


}
