
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../services/toaster.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-bundle-product-editor',
  templateUrl: './bundle-product-editor.component.html',
  styleUrl: './bundle-product-editor.component.scss'
})



export class BundleProductEditorComponent {

  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns: string[] = ['productId', 'qty', 'actions'];
  productForm: FormGroup;
  productId: any;
  subCategories: any[] = [];
  categories: any[] = [];
  mixAndMatchGroups: any[] = [];
  productImagePreview: any = null;
  categoryFilterCtrl: FormControl = new FormControl();
  filteredCategories: any[] = [];
  subCategoryFilterCtrl: FormControl = new FormControl();
  filteredSubCategories: any[] = [];
  filteredMixAndMatchGroups: any[] = [];
  products: any[] = [];
  filteredProducts: any[][] = [];
  productFilterCtrls: FormControl[] = [];

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
      isBundle: true,
      isOutOfStock: false,
      isVatEnabled: false,
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      mixMatchGroupId: [null],
      description: null,
      specification: null,
      buyingPrice: [null, Validators.required],
      sellingPrice: [null, Validators.required],
      commissionToAgent: [null, [Validators.required]],
      commissionToManager: [null, [Validators.required]],
      //colourList: [[]],
      //sizeList: [[]],
      status: true,
      productImage: null as File | null,
      productPrices: this.fb.array([]),
      bundleItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.productImagePreview = '/assets/images/profile/user-1.jpg';
    this.getCategoryLookup();

    this.categoryFilterCtrl.valueChanges.subscribe(() => {
      this.filterCategories();
    });

    this.subCategoryFilterCtrl.valueChanges.subscribe(() => {
      this.filterSubCategories();
    });

    this.lookupService.getProducts().subscribe(res => {
      this.products = res.data;
      if (this.productId) {
        this.getProductDetails();
      } else {
        this.addItemRow(); // create mode
      }
    });
  }

  private filterCategories() {
    const search = this.categoryFilterCtrl.value?.toLowerCase() || '';
    this.filteredCategories = this.categories.filter((item: any) =>
      `${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterSubCategories() {
    const search = this.subCategoryFilterCtrl.value?.toLowerCase() || '';
    this.filteredSubCategories = this.subCategories.filter((item: any) =>
      `${item.name}`.toLowerCase().includes(search)
    );
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
      this.filteredCategories = res.data;
    });
  }

  getSubCategoryLookup(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategories = res.data;
      this.filteredSubCategories = res.data;
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
        // this.productForm.patchValue({
        //   commissionToAgent: res.data.productCommission?.commissionToAgent != null
        //     ? Number(res.data.productCommission.commissionToAgent)
        //     : null,

        //   commissionToManager: res.data.productCommission?.commissionToManager != null
        //     ? Number(res.data.productCommission.commissionToManager)
        //     : null,

        //   status: res.data.product?.status
        // });
        if (res.data.product?.productImage) {
          this.productImagePreview = environment.backend.host + '/' + res.data.product?.productImage;
        }
        if (res.data.product?.categoryId) {
          this.getSubCategoryLookup(res.data.product?.categoryId);
        }
        this.populateProductPrices(res.data.productPrices || []);
        res.data.bundleItems.forEach((item: any) => this.addItemRow(item));
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
      formBody.append('description', this.productForm.value.description || '');
      formBody.append('specification', this.productForm.value.specification || '');
      formBody.append('buyingPrice', this.productForm.value.buyingPrice || '');
      formBody.append('sellingPrice', this.productForm.value.sellingPrice || '');
      formBody.append('isNewArrival', this.productForm.value.isNewArrival ?? false);
      formBody.append('isOutOfStock', this.productForm.value.isOutOfStock ?? false);
      formBody.append('isBundle', this.productForm.value.isBundle ?? true);
      formBody.append('categoryId', this.productForm.value.categoryId);
      formBody.append('subCategoryId', this.productForm.value.subCategoryId);
      formBody.append('mixMatchGroupId', this.productForm.value.mixMatchGroupId ?? 0);
      formBody.append('status', (this.productForm.value.status ?? false) ? '1' : '0');
      formBody.append('commissionToAgent', this.productForm.value.commissionToAgent);
      formBody.append('commissionToManager', this.productForm.value.commissionToManager);

      if (this.productForm.value.productImage) {
        formBody.append('productImageFile', this.productForm.value.productImage);
      }

      if (this.productForm.value.bundleItems && Array.isArray(this.productForm.value.bundleItems)) {
        this.productForm.value.bundleItems.forEach((item: any, index: number) => {
          formBody.append(`bundleItems[${index}].productBundleId`, item.productBundleId);
          formBody.append(`bundleItems[${index}].productId`, item.productId);
          formBody.append(`bundleItems[${index}].quantity`, item.quantity);
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

  get bundleItems(): FormArray {
    return this.productForm.get('bundleItems') as FormArray;
  }

  createItemRow(item: any = {}): FormGroup {
    return this.fb.group({
      productBundleId: [item.productBundleId || 0],
      productId: [item.productId || null, Validators.required],
      quantity: [item.quantity || 0, Validators.required],
    });
  }

  addItemRow(item: any = {}) {
    this.bundleItems.push(this.createItemRow(item));

    const ctrl = new FormControl('');
    const index = this.bundleItems.length - 1;

    this.productFilterCtrls.push(ctrl);
    this.filteredProducts[index] = [...this.products];

    ctrl.valueChanges.subscribe((search: any) => {
      this.filteredProducts[index] = this.filterProducts(search);
    });

    this.table?.renderRows();
  }

  removeRow(index: number) {
    this.bundleItems.removeAt(index);
    this.productFilterCtrls.splice(index, 1);
    this.filteredProducts.splice(index, 1);
    this.table.renderRows();
  }

  filterProducts(search: string): any[] {
    if (!search) return this.products;

    search = search.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }

  onProductSelected(productId: number, index: number) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const row = this.bundleItems.at(index) as FormGroup;
    row.patchValue({
      purchasePrice: product.price
    });
  }

}
