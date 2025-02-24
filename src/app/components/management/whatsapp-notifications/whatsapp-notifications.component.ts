import { Component } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { BulkUploadService } from '../../../services/bulk-upload.service';

@Component({
  selector: 'app-whatsapp-notifications',
  templateUrl: './whatsapp-notifications.component.html',
  styleUrl: './whatsapp-notifications.component.scss'
})

export class WhatsappNotificationsComponent {
  fromDate: any = null;
  toDate: any = null;
  reportType: string | null = '';

  constructor
    (
      private bulkUploadService: BulkUploadService,
      private toasterService: ToasterService,
    ) { }


  onSubmit(): void {

  }

  onClear(): void {
    this.fromDate = null;
    this.toDate = null;
    this.reportType = '';
  }

}