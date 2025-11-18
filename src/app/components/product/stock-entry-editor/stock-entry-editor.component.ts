
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LookupService } from '../../../services/lookup.service';
import { startWith, map } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PurchaseService } from '../../../services/purchase.service';
import { ToasterService } from '../../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  filteredProducts: any[] = [];



  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private purchaseService: PurchaseService,
    private toasterService: ToasterService
  ) {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    this.invoiceForm = this.fb.group({
      purchaseInvoiceId: [this.invoiceId],
      invoiceNumber: [{ value: '', disabled: this.invoiceId != null ? true : false }, Validators.required],
      invoiceDate: ['', Validators.required],
      supplierId: ['', Validators.required],
      totalAmount: ['', Validators.required],
      items: this.fb.array([this.createItemRow()])
    });
    this.initProductFilter(0);
  }

  ngOnInit(): void {

    this.lookupService.getSuppliers().subscribe((res) => {
      this.suppliers = res.data;
    });

    this.lookupService.getProducts().subscribe((res) => {
      this.products = res.data;
      if (this.invoiceId) {
        this.getInvoiceDetails();
      }
    });

  }

  getInvoiceDetails() {
    if (this.invoiceId) {
      this.purchaseService.get(this.invoiceId).subscribe((res) => {
        this.invoiceForm.patchValue(res.data);
      });

      this.purchaseService.getItems(this.invoiceId).subscribe((res) => {
        this.populateItems(res.data);
      });
    }
  }

  populateItems(invoiceItems: any[]): void {
    const documentFormArray = this.invoiceForm.get('items') as FormArray;
    documentFormArray.clear();
    invoiceItems.forEach(e => {
      this.items.push(this.loadAccounts(e));
      this.initProductFilter(this.items.length - 1);
      this.table.renderRows();
    });

  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  loadAccounts(item: any = {}): FormGroup {
    return this.fb.group({
      purchaseInvoiceItemId: [item.purchaseInvoiceItemId],
      productId: [item.productId, [Validators.required]],
      quantity: [item.quantity, [Validators.required]],
      purchasePrice: [item.purchasePrice, [Validators.required]],
      productSearch: [this.products.find(x => x.id === item.productId)?.name],
    })
  }

  createItemRow(): FormGroup {
    return this.fb.group({
      purchaseInvoiceItemId: [null],
      productId: [null, Validators.required],
      productSearch: [''],
      quantity: [0, Validators.required],
      purchasePrice: [0, Validators.required],
    });
  }

  addItemRow() {
    this.items.push(this.createItemRow());
    this.initProductFilter(this.items.length - 1);
    this.table.renderRows();
  }

  removeRow(i: number) {
    this.items.removeAt(i);
    this.table.renderRows();
  }

  saveInvoice() {
    if (this.invoiceForm.invalid) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...this.invoiceForm.getRawValue()
    };

    if (this.invoiceId) {
      this.purchaseService.update(payload).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage("Updated successfully.");
          this.router.navigate(['/invoice/list']);
        }
        else {
          this.toasterService.showMessage(res.data);
        }
      });
    }
    else {
      this.purchaseService.create(payload).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage("Created successfully.");
          this.router.navigate(['/invoice/list']);
        }
        else {
          this.toasterService.showMessage(res.data);
        }
      });
    }

  }

  onProductSelected(product: any, index: number) {
    const row = this.items.at(index);
    row.get('productId')?.setValue(product.id);
    row.get('productSearch')?.setValue(product.name, { emitEvent: false });
  }

  initProductFilter(index: number) {
    const searchCtrl = this.items.at(index).get('productSearch')!;

    this.filteredProducts[index] = searchCtrl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this.filterProducts(value))
    );
  }

  filterProducts(value: string) {
    const filterValue = value.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(filterValue)
    );
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    // small timeout avoids expression changed error
    trigger.openPanel();
  }

}
