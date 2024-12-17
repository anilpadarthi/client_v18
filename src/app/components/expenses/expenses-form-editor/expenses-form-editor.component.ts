import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expenses-form-editor',
  templateUrl: './expenses-form-editor.component.html',
  styleUrl: './expenses-form-editor.component.scss'
})
export class ExpensesFormEditorComponent {
  expenseForm: FormGroup;
  categories = ['Food', 'Transport', 'Office Supplies', 'Travel', 'Miscellaneous'];
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      expenseName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
      date: ['', Validators.required],
      receipts: [null]
    });
  }

  onFileSelect(event: any) {
    if (event.target.files) {
      this.selectedFiles.push(...event.target.files);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      console.log('Form Submitted:', this.expenseForm.value);
      console.log('Receipts:', this.selectedFiles);
    } else {
      console.log('Form is invalid');
    }
  }
}
