import { Component } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { BulkUploadService } from '../../../services/bulk-upload.service';
import { ServiceControlService } from '../../../services/service-control.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss'
})

export class BulkUploadComponent {
  importFile: File | null = null;
  importFileType: string | null = '';
  status = '';
  selectedDate = '';

  constructor
    (
      private bulkUploadService: BulkUploadService,
      private toasterService: ToasterService,
      private svc: ServiceControlService,
      private datePipe: DatePipe
    ) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importFile = file;
    }
  }

  // Upload file to the backend
  uploadFile(): void {
    if (this.importFile && this.importFileType != '') {
      const formData = new FormData();
      formData.append('importFile', this.importFile);
      formData.append('importType', this.importFileType || '');
      formData.append('SelectedDate', this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '');

      this.bulkUploadService.uploadFile(formData).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage(res.data);
          this.importFileType = '';
          this.importFile = null;
          this.selectedDate = '';
        }
        else {
          this.toasterService.showMessage(res.message);
        }
        this.resetControls();
      });
    }
    else {
      this.toasterService.showMessage('Please select both import file type and file to process further.');
    }
  }

  startService() {
    this.svc.startService().subscribe(() => this.refreshStatus());
  }

  stopService() {
    this.svc.stopService().subscribe(() => this.refreshStatus());
  }

  refreshStatus() {
    this.svc.getStatus().subscribe(s => this.status = s);
  }

  resetControls() {
    this.importFileType = "";
    this.importFile = null;

    // Clear input field manually
    const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

}
