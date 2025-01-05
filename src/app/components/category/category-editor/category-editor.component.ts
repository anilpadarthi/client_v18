import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrl: './category-editor.component.scss'
})

export class CategoryEditorComponent {

  categoryForm: FormGroup;
  categoryId: any;
  categoryImagePreview: any = null;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private categoryService: CategoryService,
      private toasterService: ToasterService,
      private fb: FormBuilder
    ) {

    this.categoryForm = this.fb.group(
      {
        categoryName: ['', [Validators.required, Validators.minLength(2)]],
        image: null as File | null,
        status: [true],
      },
    );
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.getCategoryDetails();
  }

  getCategoryDetails() {
    if (this.categoryId) {
      this.categoryService.getCategory(this.categoryId).subscribe((res) => {
        this.categoryForm.patchValue(res.data);
        if (res.data?.image) {
          this.categoryImagePreview = environment.backend.host + '/' + res.data?.image;
        }
      });
    }
  }

  onSave() {
    if (this.categoryForm.valid) {
      
      const formBody = new FormData();
      formBody.append('categoryId', this.categoryId != null ? this.categoryId : 0);
      formBody.append('categoryName', this.categoryForm.value.categoryName);
      formBody.append('status', this.categoryForm.value.status ? '1' : '0');
      formBody.append('imageFile', this.categoryForm.value.image);

      if (this.categoryId != null) {
        this.categoryService.updateCategory(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/categories']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.categoryService.createCategory(formBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/categories']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.categoryForm.patchValue({ image: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.categoryImagePreview = event?.target?.result;
    }
  }

}
