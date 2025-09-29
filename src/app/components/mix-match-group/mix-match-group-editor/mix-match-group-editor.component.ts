import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MixMatchGroupService } from '../../../services/mix-match-group.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mix-match-group-editor',
  templateUrl: './mix-match-group-editor.component.html',
  styleUrl: './mix-match-group-editor.component.scss'
})

export class MixMatchGroupEditorComponent {

  mixMatchGroupForm: FormGroup;
  mixMatchGroupId: any;
  categoryImagePreview: any = null;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private mixMatchGroupService: MixMatchGroupService,
      private toasterService: ToasterService,
      private fb: FormBuilder
    ) {

    this.mixMatchGroupForm = this.fb.group(
      {
        groupName: ['', [Validators.required, Validators.minLength(2)]],
        status: [true],
      },
    );
  }

  ngOnInit(): void {
    this.mixMatchGroupId = this.route.snapshot.paramMap.get('id');
    this.getCategoryDetails();
  }

  getCategoryDetails() {
    if (this.mixMatchGroupId) {
      this.mixMatchGroupService.getMixMatchGroup(this.mixMatchGroupId).subscribe((res) => {
        this.mixMatchGroupForm.patchValue(res.data);
        if (res.data?.image) {
          this.categoryImagePreview = environment.backend.host + '/' + res.data?.image;
        }
      });
    }
  }

  onSave() {
    if (this.mixMatchGroupForm.valid) {
      
      const formBody = new FormData();
      formBody.append('mixMatchGroupId', this.mixMatchGroupId != null ? this.mixMatchGroupId : 0);
      formBody.append('groupName', this.mixMatchGroupForm.value.groupName);
      formBody.append('status', this.mixMatchGroupForm.value.status ? '1' : '0');

      if (this.mixMatchGroupId != null) {
        this.mixMatchGroupService.updateMixMatchGroup(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/mix-match-groups']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.mixMatchGroupService.createMixMatchGroup(formBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/mix-match-groups']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/mix-match-groups']);
  }
  

}
