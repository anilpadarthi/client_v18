import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agreement-form-editor',
  templateUrl: './agreement-form-editor.component.html',
  styleUrl: './agreement-form-editor.component.scss'
})
export class AgreementFormEditorComponent {


  agreementForm: FormGroup;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder) {
    this.agreementForm = this.fb.group({
      agreementNotes: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.agreementForm.valid) {
      // Handle form submission logic
    } else {
    }
  }

  onImageSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }
}
