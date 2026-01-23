import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Input() selectedProduct!: any;
  @Output() notifyParent = new EventEmitter<any>();
  @Output() backToList = new EventEmitter<void>();
  quantity = 1;
  hasPriceStructure = false;
  lowestPrice: any;
  totalQuantity: number = 0;

  displayedColumns: string[] = ['fromQty', 'toQty', 'salePrice'];
  bundleItemColumns: string[] = ['ProductId', 'Name', 'qty']


  constructor(private productService: ProductService) { }

  selectImage(img: string) {
  }


  increaseQuantity() {
    if (this.selectedProduct.qty == undefined || this.selectedProduct.qty == null) {
      this.selectedProduct.qty = 1;
    }
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  ngOnInit(): void {

    if (this.selectedProduct?.productPrices?.length > 1) {
      this.hasPriceStructure = true;
      this.lowestPrice = Math.min(...this.selectedProduct.productPrices.map((p: any) => p.salePrice));
    }

  }
  addToCart(): void {
    this.selectedProduct.qty = this.quantity;
    this.notifyParent.emit(this.selectedProduct);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedProduct) {
      this.totalQuantity = this.selectedProduct.bundleItems?.reduce((acc: number, item: any) => acc + (item.quantity ?? 0), 0) || 0;
    }

    if (this.selectedProduct) {
      this.selectedProduct.qty = null;
    }
  }

  goBack() {
    this.backToList.emit();   // 👈 send event to parent
  }
}
