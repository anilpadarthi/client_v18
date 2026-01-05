import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { LookupService } from '../../../services/lookup.service';
import { PurchaseService } from '../../../services/purchase.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cleanDate } from '../../../helpers/utils';

@Component({
  selector: 'app-stock-entry-editor',
  templateUrl: './stock-entry-editor.component.html',
  styleUrl: './stock-entry-editor.component.scss'
})
export class StockEntryEditorComponent implements OnInit {

  invoiceForm!: FormGroup;
  displayedColumns: string[] = ['productId', 'qty', 'price', 'actions'];
  @ViewChild(MatTable) table!: MatTable<any>;

  invoiceId: any;
  suppliers: any[] = [];
  products: any[] = [];

  filteredProducts: any[][] = [];          // array per row
  productFilterCtrls: FormControl[] = [];  // control per row

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private purchaseService: PurchaseService,
    private toasterService: ToasterService
  ) {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    this.invoiceForm = this.fb.group({
      purchaseInvoiceId: [this.invoiceId],
      invoiceNumber: [{ value: '', disabled: !!this.invoiceId }, Validators.required],
      invoiceDate: ['', Validators.required],
      supplierId: ['', Validators.required],
      totalAmount: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.lookupService.getSuppliers().subscribe(res => {
      this.suppliers = res.data;
    });

    this.lookupService.getProducts().subscribe(res => {
      this.products = res.data;

      if (this.invoiceId) {
        this.getInvoiceDetails();
      } else {
        this.addItemRow(); // create mode
      }
    });
  }

  // ---------------------------------
  // FormArray getter
  // ---------------------------------
  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // ---------------------------------
  // Create row
  // ---------------------------------
  createItemRow(item: any = {}): FormGroup {
    return this.fb.group({
      purchaseInvoiceItemId: [item.purchaseInvoiceItemId || null],
      productId: [item.productId || null, Validators.required],
      quantity: [item.quantity || 0, Validators.required],
      purchasePrice: [item.purchasePrice || 0, Validators.required],
    });
  }

  // ---------------------------------
  // Add row
  // ---------------------------------
  addItemRow(item: any = {}) {
    this.items.push(this.createItemRow(item));

    const ctrl = new FormControl('');
    const index = this.items.length - 1;

    this.productFilterCtrls.push(ctrl);
    this.filteredProducts[index] = [...this.products];

    ctrl.valueChanges.subscribe((search: any) => {
      this.filteredProducts[index] = this.filterProducts(search);
    });

    this.table?.renderRows();
  }

  // ---------------------------------
  // Remove row
  // ---------------------------------
  removeRow(index: number) {
    this.items.removeAt(index);
    this.productFilterCtrls.splice(index, 1);
    this.filteredProducts.splice(index, 1);
    this.table.renderRows();
  }

  // ---------------------------------
  // Filter products
  // ---------------------------------
  filterProducts(search: string): any[] {
    if (!search) return this.products;

    search = search.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }

  // ---------------------------------
  // Product selection
  // ---------------------------------
  onProductSelected(productId: number, index: number) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const row = this.items.at(index) as FormGroup;
    row.patchValue({
      purchasePrice: product.price
    });
  }

  // ---------------------------------
  // Load invoice (Edit mode)
  // ---------------------------------
  getInvoiceDetails() {
    this.purchaseService.get(this.invoiceId).subscribe(res => {
      this.invoiceForm.patchValue(res.data);
    });

    this.purchaseService.getItems(this.invoiceId).subscribe(res => {
      this.items.clear();
      this.productFilterCtrls = [];
      this.filteredProducts = [];

      res.data.forEach((item: any) => this.addItemRow(item));
    });
  }

  // ---------------------------------
  // Save
  // ---------------------------------
  saveInvoice() {
    if (this.invoiceForm.invalid) {
      this.toasterService.showMessage('Please fill all required fields');
      return;
    }

    const requestBody = {
      ...this.invoiceForm.getRawValue(),
      invoiceDate: cleanDate(this.invoiceForm.value.invoiceDate)
    };

    const apiCall = this.invoiceId
      ? this.purchaseService.update(requestBody)
      : this.purchaseService.create(requestBody);

    apiCall.subscribe(res => {
      if (res.statusCode === 200) {
        this.toasterService.showMessage(
          this.invoiceId ? 'Updated successfully' : 'Created successfully'
        );
        this.router.navigate(['/invoice/list']);
      } else {
        this.toasterService.showMessage(res.data);
      }
    });
  }

  cancel() {
    this.router.navigate(['/invoice/list']);
  }
}
