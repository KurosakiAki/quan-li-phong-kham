import { Injectable } from '@angular/core';
import { menuItems } from '../../menu-items';

export interface IMenuItem {
    path: string;
    title: string;
    children?: IMenuItem[];
    isExpand?: boolean;
}

export interface ILayoutState {
    menuItems: IMenuItem[];
}

export interface ILayoutUserState {
    userRoleCode: string;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
    private _state: ILayoutState = {
        menuItems: menuItems
    }

    get state() {
        return this._state;
    }

    constructor() { }

    getUserRecursiveMenu(menuItems: any[], userRoleCode: string) {
        const retMenuItems = menuItems.reduce((total, item) => {
            if (item.children) {
                item.children = this.getUserRecursiveMenu(item.children, userRoleCode)
            }
            if (!item.roles || item.roles.includes(userRoleCode)) {
                return [...total, item]
            } else {
                return total
            }
        }, [])

        return retMenuItems
    }

    setState(key: string, value: any) {
        this._state = {...this._state, [key]: value};
    }
}