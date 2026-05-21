import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { ManagementService } from '../../../services/management.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})

export class ConfigurationComponent implements OnInit {

  chequeCutOffDay: any = null;

  chequestRequestCutOffDate: any[] = [];

  constructor(private toasterService: ToasterService, private managementService: ManagementService) {

    this.chequestRequestCutOffDate = Array.from({ length: 12 }, (_, i) => i + 20);
  }

  ngOnInit() {
    this.managementService.getConfiguration().subscribe((res) => {
      if (res.statusCode === 200 && res.data) {
        this.chequeCutOffDay = parseInt(res.data.chequeCutOffDay);
      }
    }); 
  }

  onSave() {
    if (this.chequeCutOffDay) {
      this.managementService.saveConfiguration(this.chequeCutOffDay).subscribe((res) => {
        if (res.statusCode === 200) {
          this.toasterService.showMessage('Configuration saved successfully.');
        }
      });
    }
    else {
      this.toasterService.showMessage('Please select a Cheque cut off day.');
    }

  }

  onCancel() {
    this.chequeCutOffDay = null;
  }

}
