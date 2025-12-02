import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaService } from '../../../services/area.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-area-editor',
  templateUrl: './area-editor.component.html',
  styleUrl: './area-editor.component.scss'
})
export class AreaEditorComponent {

  areaForm: FormGroup;
  areaId: any;
  userRole = '';
  isAdmin = false;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private areaService: AreaService,
      private toasterService: ToasterService,
      public webstorgeService: WebstorgeService,
      private fb: FormBuilder
    ) {

    this.areaForm = this.fb.group(
      {
        areaName: ['', [Validators.required, Validators.minLength(2)]],
        status: [true],
      },
    );
  }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'CallCenter') {
      this.isAdmin = true;
    }
    this.areaId = this.route.snapshot.paramMap.get('id');
    this.getAreaDetails();
  }

  getAreaDetails() {
    if (this.areaId) {
      this.areaService.getArea(this.areaId).subscribe((res) => {
        this.areaForm.patchValue(res.data);

      });
    }
  }

  onSave() {
    if (this.areaForm.valid) {
      const requestBody = {
        "areaId": this.areaId != null ? this.areaId : 0,
        "areaName": this.areaForm.value.areaName.trim(),
        "status": this.areaForm.value.status ? 1 : 0
      };

      if (this.areaId != null) {
        this.areaService.updateArea(requestBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/areas']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.areaService.createArea(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/areas']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/areas']);
  }

}
