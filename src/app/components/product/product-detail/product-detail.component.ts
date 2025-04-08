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
  quantity = 1;

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

  }
  addToCart(): void {
    this.selectedProduct.qty = this.quantity;
    this.notifyParent.emit(this.selectedProduct);
  }


  ngOnChanges(): void {
    this.selectedProduct.qty = null;
  }
}
