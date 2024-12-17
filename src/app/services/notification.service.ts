import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    constructor(
        private messageService: MessageService
    ) { }

    error(text: string): void {
        this.messageService.add({
            summary: 'Toast',
            detail: text,
            styleClass: 'success-light-popover',
        });
    }

    warning(text: string): void {
        this.messageService.add({
            summary: 'Toast',
            detail: text,
            styleClass: 'success-light-popover',
        });
    }

    success(text: string): void {
        this.messageService.add({
            summary: 'Toast',
            detail: text,
            styleClass: 'success-light-popover',
        });
    }
}