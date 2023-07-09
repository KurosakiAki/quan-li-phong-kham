/**
 * Hiển thị thông tin lịch sử sửa đổi của 1 đối tượng
 * @Example
 *          <system-log [objectType]="systemLogType" [objectId]="userId">
                <ng-template system-log-new-content let-log="log">
                    <span translate>Người dùng đã được tạo</span>
                </ng-template>
                <ng-template system-log-content let-log="log">
                    <ul>
                        <li *ngFor="let change of log.changeData">
                            {{userService.columnsDescription[change.field]}}: {{change.oldValue}} -> {{change.newValue}}
                        </li>
                    </ul>
                </ng-template>
            </system-log>
 */
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { SystemLogContentDirective, SystemLogNewContentDirective } from './system-log.directive';
import { SystemLogService } from './system-log.service';

@Component({
    selector: 'system-log',
    templateUrl: 'system-log.component.html'
})
export class SystemLogComponent implements OnInit {
    logType = SystemLogTypeEnum;

    @Input() objectType!: SystemLogObjectTypeEnum;
    @Input() objectId!: number;

    @ContentChild(SystemLogContentDirective, { read: TemplateRef }) contentTemplate!: TemplateRef<any>;
    @ContentChild(SystemLogNewContentDirective, { read: TemplateRef }) newContentTemplate!: TemplateRef<any>;
    logs: any;

    constructor(
        private systemLogService: SystemLogService
    ) { }

    ngOnInit() {
        this.systemLogService.list(this.objectType, this.objectId).subscribe(data => this.logs = data);
    }
}