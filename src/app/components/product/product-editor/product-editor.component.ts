import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../services/toaster.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss'
})

export class ProductEditorComponent {

  productForm: FormGroup;
  productId: any;
  subCategories: any[] = [];
  categories: any[] = [];
  productImagePreview: any = null;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private productService: ProductService,
      private toasterService: ToasterService,
      private lookupService: LookupService,
      private fb: FormBuilder
    ) {

    this.productForm = this.fb.group({
      productId: 0,
      productName: [null, Validators.required],
      productCode: [null, Validators.required],
      displayOrder: 0,
      isNewArrival: false,
      isBundle: false,
      isOutOfStock: false,
      isVatEnabled: false,
      categoryId: null,
      subCategoryId: null,
      description: null,
      specification: null,
      //colourList: [[]],
      //sizeList: [[]],
      status: true,
      productImage: null as File | null,
      productPrices: this.fb.array([this.createChild()], Validators.required)
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.getCategoryLookup();
    this.getProductDetails();
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  getSubCategoryLookup(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategories = res.data;
    });
  }

  onCategoryChange(event: any) {
    if (event.value) {
      this.getSubCategoryLookup(event.value);
    }
  }

  getProductDetails() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe((res) => {
        this.productForm.patchValue(res.data.product);
        if (res.data.product?.productImage) {
          this.productImagePreview = environment.backend.host + '/' + res.data.product?.productImage;
        }
        this.populateProductPrices(res.data.productPrices || []);
      });
    }
  }

  populateProductPrices(userDocuments: any[]): void {
    const priceFormArray = this.productForm.get('productPrices') as FormArray;
    priceFormArray.clear();
    let documentIndex = 0;
    userDocuments.forEach(e => {
      priceFormArray.push(this.loadChild(e));
      documentIndex++;
    });
    this.productForm.setControl('productPrices', priceFormArray);
  }

  loadChild(productPrice: any = {}): FormGroup {
    return this.fb.group({
      productPriceId: productPrice.productPriceId,
      productId: productPrice.productId,
      fromQty: [productPrice.fromQty, [Validators.required]],
      toQty: [productPrice.toQty, [Validators.required]],
      salePrice: [productPrice.salePrice, [Validators.required]],
    })
  }

  onSave() {
    if (this.productForm.valid) {
      const formBody = new FormData();

      formBody.append('productId', this.productId != null ? this.productId : 0);
      formBody.append('productName', this.productForm.value.productName);
      formBody.append('productCode', this.productForm.value.productCode);
      formBody.append('description', this.productForm.value.description);
      formBody.append('specification', this.productForm.value.specification);
      formBody.append('isNewArrival', this.productForm.value.isNewArrival);
      formBody.append('isOutOfStock', this.productForm.value.isOutOfStock);
      formBody.append('categoryId', this.productForm.value.categoryId);
      formBody.append('subCategoryId', this.productForm.value.subCategoryId);
      formBody.append('status', this.productForm.value.status ? '1' : '0');
      formBody.append('productImageFile', this.productForm.value.productImage);

      if (this.productForm.value.productPrices && Array.isArray(this.productForm.value.productPrices)) {
        this.productForm.value.productPrices.forEach((price: any, index: number) => {
          formBody.append(`productPrices[${index}].fromQty`, price.fromQty);
          formBody.append(`productPrices[${index}].toQty`, price.toQty);
          formBody.append(`productPrices[${index}].salePrice`, price.salePrice);
          formBody.append(`productPrices[${index}].productPriceId`, price.productPriceId != null ? price.productPriceId : 0);
          formBody.append(`productPrices[${index}].productId`, price.productId != null ? price.productId : 0);
        });
      }

      if (this.productId != null) {
        this.productService.updateProduct(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Saved successfully.");
            this.router.navigate(['/products']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.productService.createProduct(formBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Saved successfully.");
            this.router.navigate(['/products']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.productForm.patchValue({ productImage: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.productImagePreview = event?.target?.result;
    }
  }

  get productPrices(): FormArray {
    return <FormArray>this.productForm.get('productPrices');
  }


  addChildProduct() {
    this.productPrices.push(this.createChild());
  }

  removeChildProduct(index: number) {
    console.log('remove the child - ', index);
    this.productPrices.removeAt(index);
  }

  validate(event: any, index: number) {
    const matches: any = this.productPrices.value.filter((item: any) => item.productPriceId === event.target.value);
    if (matches.length > 1) {
      //this.productPrices.controls[index].get('childProductId').setErrors({ 'duplicate': true });
    }
  }

  createChild(): FormGroup {
    return this.fb.group({
      productPriceId: [null],
      productId: [null],
      fromQty: [null, Validators.required],
      toQty: [null, Validators.required],
      salePrice: [null, Validators.required]
    });
  }

}
