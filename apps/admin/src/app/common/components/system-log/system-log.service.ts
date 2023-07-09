import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemLogObjectTypeEnum } from '@api-interfaces';

@Injectable({providedIn: 'root'})
export class SystemLogService {
    constructor(
        private http: HttpClient
    ) { }
    
    list(objectType: SystemLogObjectTypeEnum, objectId: number) {
        return this.http.get(`/api/system-log/${objectType}/${objectId}`)
    }
}