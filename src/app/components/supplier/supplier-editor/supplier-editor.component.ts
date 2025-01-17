import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-supplier-editor',
  templateUrl: './supplier-editor.component.html',
  styleUrl: './supplier-editor.component.scss'
})


export class SupplierEditorComponent {

  supplierForm: FormGroup;
  supplierId: any;
  networkLookup: any = [];

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private supplierService: SupplierService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private fb: FormBuilder
    ) {

    this.supplierForm = this.fb.group(
      {
        supplierId: 0,
        supplierName: [null, Validators.required],
        status: [true],
        supplierAccounts: this.fb.array([this.createSupplierAccount()], Validators.required),
        supplierProducts: this.fb.array([this.createSupplierProduct()], Validators.required)
      },
    );
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    this.getSupplierDetails();
    this.getNetworkLookup();
  }



  getSupplierDetails() {
    if (this.supplierId) {
      this.supplierService.getSupplier(this.supplierId).subscribe((res) => {
        this.supplierForm.patchValue(res.data.supplier);
        this.populateSupplierAccounts(res.data.supplierAccounts || []);
        this.populateSupplierProducts(res.data.supplierProducts || []);
      });
    }
  }

  onSave() {
    if (this.supplierForm.valid) {
      const requestBody = {
        "supplierId": this.supplierId != null ? this.supplierId : 0,
        "supplierName": this.supplierForm.value.supplierName,
        "supplierAccounts": this.supplierForm.value.supplierAccounts,
        "supplierProducts": this.supplierForm.value.supplierProducts,
        "status": this.supplierForm.value.status ? 1 : 0
      };

      if (this.supplierId != null) {
        this.supplierService.updateSupplier(requestBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/suppliers']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.supplierService.createSupplier(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/suppliers']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }

  getNetworkLookup() {
    this.lookupService.getNetowrks().subscribe((res) => {
      this.networkLookup = res.data;
    });
  }

  populateSupplierAccounts(supplierAccounts: any[]): void {
    const documentFormArray = this.supplierForm.get('supplierAccounts') as FormArray;
    documentFormArray.clear();
    supplierAccounts.forEach(e => {
      documentFormArray.push(this.loadAccounts(e));
    });
    this.supplierForm.setControl('supplierAccounts', documentFormArray);
  }

  populateSupplierProducts(supplierProducts: any[]): void {
    const documentFormArray = this.supplierForm.get('supplierProducts') as FormArray;
    documentFormArray.clear();
    supplierProducts.forEach(e => {
      documentFormArray.push(this.loadProducts(e));
    });
    this.supplierForm.setControl('supplierProducts', documentFormArray);
  }

  loadAccounts(supplierAccount: any = {}): FormGroup {
    return this.fb.group({
      supplierAccountId: supplierAccount.supplierAccountId,
      accountName: [supplierAccount.accountName, [Validators.required]],
      accountNumber: [supplierAccount.accountNumber, [Validators.required]],
    })
  }

  loadProducts(supplierProduct: any = {}): FormGroup {
    return this.fb.group({
      supplierProductId: supplierProduct.supplierProductId,
      productId: [supplierProduct.productId, [Validators.required]],
      productCost: [supplierProduct.productCost, [Validators.required]],
    })
  }

  createSupplierAccount(): FormGroup {
    return this.fb.group({
      supplierAccountId: 0,
      AccountName: ['', Validators.required],
      AccountNumber: ['', Validators.required],
    })
  }

  createSupplierProduct(): FormGroup {
    return this.fb.group({
      supplierProductId: 0,
      productId: ['', Validators.required],
      productCost: ['', Validators.required]
    })
  }

  get supplierProducts(): FormArray {
    return <FormArray>this.supplierForm.get('supplierProducts');
  }

  addSupplierProduct() {
    this.supplierProducts.push(this.createSupplierProduct());
  }

  removeSupplierProduct(index: number) {
    this.supplierProducts.removeAt(index);
  }

  validate(supplierProductId: any, index: number) {
    const matches: any = this.supplierProducts.value.filter((item: any) => item.supplierProductId === supplierProductId);

    setTimeout(() => {
      if (matches.length > 1) {
        this.supplierProducts.controls[index].get('supplierProductId')?.setErrors({ 'duplicate': true });
      } else {
        this.supplierProducts.controls[index].get('supplierProductId')?.setErrors(null);
      }
      this.supplierProducts.updateValueAndValidity();
    })

  }

  get supplierAccounts(): FormArray {
    return <FormArray>this.supplierForm.get('supplierAccounts');
  }

  addSupplierAccount() {
    this.supplierAccounts.push(this.createSupplierAccount());
  }

  removeSupplierAccount(index: number) {
    this.supplierAccounts.removeAt(index);
  }

  validateAccount(supplierAccountId: any, index: number) {
    const matches: any = this.supplierAccounts.value.filter((item: any) => item.supplierAccountId === supplierAccountId);

    setTimeout(() => {
      if (matches.length > 1) {
        this.supplierAccounts.controls[index].get('supplierAccountId')?.setErrors({ 'duplicate': true });
      } else {
        this.supplierAccounts.controls[index].get('supplierAccountId')?.setErrors(null);
      }
      this.supplierAccounts.updateValueAndValidity();
    })

  }

}
