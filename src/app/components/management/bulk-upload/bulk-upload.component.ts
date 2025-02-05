import { Component } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { BulkUploadService } from '../../../services/bulk-upload.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss'
})

export class BulkUploadComponent {
  importFile: File | null = null;
  importFileType: string | null = '';

  constructor
    (
      private bulkUploadService: BulkUploadService,
      private toasterService: ToasterService,
    ) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importFile = file;
    }
  }

  // Upload file to the backend
  uploadFile(): void {
console.log(this.importFile);
    if (this.importFile && this.importFileType != '') {
      const formData = new FormData();
      formData.append('importFile', this.importFile);
      formData.append('importType', this.importFileType || '');
      this.bulkUploadService.uploadFile(formData).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage(res.data);
          this.importFileType = '';
          this.importFile = null;
        }
        else {
          this.toasterService.showMessage(res.message);
        }
      });
    }
    else {
      this.toasterService.showMessage('Please select both import file type and file to process further.');
    }

  }

}
