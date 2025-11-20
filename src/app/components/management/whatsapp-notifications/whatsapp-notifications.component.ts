import { Component } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { ManagementService } from '../../../services/management.service';
import { cleanDate } from '../../../helpers/utils';

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
      private managementService: ManagementService,
      private toasterService: ToasterService,
    ) { }


  onSubmit(): void {
    let requestBody = {
      RequestType: this.reportType,
      FromDate: cleanDate(this.fromDate),
      ToDate: cleanDate(this.toDate)
    }
    this.managementService.CreateWhatsAppNotificationRequest(requestBody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Request submitted, It is being processed soon.");
        this.onClear();
      }
      else {
        this.toasterService.showMessage(res.message);
      }
    });

  }

  onClear(): void {
    this.fromDate = null;
    this.toDate = null;
    this.reportType = '';
  }

}