import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubCategoryService } from '../../../services/subCategory.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sub-category-editor',
  templateUrl: './sub-category-editor.component.html',
  styleUrl: './sub-category-editor.component.scss'
})

export class SubCategoryEditorComponent {

  subCategoryForm: FormGroup;
  subCategoryId: any;
  subCtegoryImagePreview: any = null;
  categoryLookup: any = [];
  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private subCategoryService: SubCategoryService,
      private toasterService: ToasterService,
      private lookupService: LookupService,
      private fb: FormBuilder
    ) {

    this.subCategoryForm = this.fb.group(
      {
        subCategoryName: ['', [Validators.required, Validators.minLength(2)]],
        categoryId: ['', [Validators.required]],
        image: null as File | null,
        status: [true],
      },
    );
  }

  ngOnInit(): void {
    this.subCategoryId = this.route.snapshot.paramMap.get('id');
    this.getSubCategoryDetails();
    this.loadCategoryLookup();
  }
  
  loadCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categoryLookup = res.data;
    });
  }
  getSubCategoryDetails() {
    if (this.subCategoryId) {
      this.subCategoryService.getSubCategory(this.subCategoryId).subscribe((res) => {
        this.subCategoryForm.patchValue(res.data);
        if (res.data?.image) {
          this.subCtegoryImagePreview = environment.backend.host + '/' + res.data?.image;
        }
      });
    }
  }

  onSave() {
    if (this.subCategoryForm.valid) {

      const formBody = new FormData();
      formBody.append('subCategoryId', this.subCategoryId != null ? this.subCategoryId : 0);
      formBody.append('categoryId', this.subCategoryForm.value.categoryId);
      formBody.append('subCategoryName', this.subCategoryForm.value.subCategoryName.trim());
      formBody.append('status', this.subCategoryForm.value.status ? '1' : '0');
      formBody.append('imageFile', this.subCategoryForm.value.image);

      if (this.subCategoryId != null) {
        this.subCategoryService.updateSubCategory(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/sub-categories']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.subCategoryService.createSubCategory(formBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/sub-categories']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/sub-categories']);
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.subCategoryForm.patchValue({ image: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.subCtegoryImagePreview = event?.target?.result;
    }
  }

}
