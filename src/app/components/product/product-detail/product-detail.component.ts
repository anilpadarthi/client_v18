import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  @Input() selectedProduct!: any;
  @Output() notifyParent = new EventEmitter<any>();
   @Output() backToList = new EventEmitter<void>();
  quantity = 1;
  hasPriceStructure = false;
  lowestPrice:any;

  displayedColumns: string[] = ['fromQty', 'toQty', 'salePrice'];


  constructor
    (
      private productService: ProductService,
    ) {
  }



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

    if(this.selectedProduct?.productPrices.length > 1) {
      this.hasPriceStructure = true;
      this.lowestPrice = Math.min(...this.selectedProduct.productPrices.map((p:any) => p.salePrice));
    }

  }
  addToCart(): void {
    this.selectedProduct.qty = this.quantity;
    this.notifyParent.emit(this.selectedProduct);
  }


  ngOnChanges(): void {
    this.selectedProduct.qty = null;
  }

  goBack() {
    this.backToList.emit();   // 👈 send event to parent
  }
}
