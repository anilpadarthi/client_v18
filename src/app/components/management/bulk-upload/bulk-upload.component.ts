import { Component } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { BulkUploadService } from '../../../services/bulk-upload.service';
import { ServiceControlService } from '../../../services/service-control.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss'
})

export class BulkUploadComponent {
  importFile: File | null = null;
  importFileType: string | null = '';
  status = '';

  constructor
    (
      private bulkUploadService: BulkUploadService,
      private toasterService: ToasterService,
      private svc: ServiceControlService
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
      this.bulkUploadService.uploadFile(formData).subscribe((res) => {
        if (res.statusCode == 200 && res.data=='Success') {          
          this.toasterService.showMessage("Uploaded successfully, It is being processed soon.");
          this.importFileType = '';
          this.importFile = null;
        }
        else {
          this.toasterService.showMessage(res.data);
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
