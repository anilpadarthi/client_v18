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
  totalActualBundlePrice: number = 0;
  imageList: string[] = [];
  selectedImageUrl: string = '';
  isFullscreenOpen: boolean = false;
  fullscreenImageUrl: string = '';

  displayedColumns: string[] = ['fromQty', 'toQty', 'salePrice'];
  bundleItemColumns: string[] = ['ProductId', 'Name', 'Qty', 'Price', 'TotalPrice'];


  constructor(private productService: ProductService) {}

  selectImage(img: string): void {
    this.selectedImageUrl = img;
  }

  openFullscreenImage(img: string): void {
    this.fullscreenImageUrl = img;
    this.isFullscreenOpen = true;
  }

  closeFullscreenImage(): void {
    this.isFullscreenOpen = false;
    this.fullscreenImageUrl = '';
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
      this.totalActualBundlePrice = this.selectedProduct.bundleItems?.reduce((acc: number, item: any) => acc + ((item.quantity ?? 0) * (item.price ?? 0)), 0) || 0;
      this.buildImageCarousel();
    }

    if (this.selectedProduct) {
      this.selectedProduct.qty = null;
    }
  }

  private buildImageCarousel(): void {
    if (!this.selectedProduct) {
      this.imageList = [];
      this.selectedImageUrl = '';
      return;
    }

    if (Array.isArray(this.selectedProduct.productImages) && this.selectedProduct.productImages.length > 0) {
      this.imageList = this.selectedProduct.productImages
        .map((img: any) => {
          if (!img) {
            return '';
          }
          if (typeof img === 'string') {
            return img;
          }
          if (img.image) {
            return img.image.startsWith('http') ? img.image : `${environment.backend.host}/${img.image}`;
          }
          if (img.url) {
            return img.url;
          }
          return '';
        })
        .filter((url: string) => !!url);
    } else if (this.selectedProduct.productImage) {
      this.imageList = [this.selectedProduct.productImage];
    } else {
      this.imageList = [];
    }

    this.selectedImageUrl = this.imageList.length > 0 ? this.imageList[0] : '';
  }

  previousImage(): void {
    if (!this.selectedImageUrl || this.imageList.length <= 1) {
      return;
    }
    const currentIndex = this.imageList.indexOf(this.selectedImageUrl);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.imageList.length - 1;
    this.selectedImageUrl = this.imageList[prevIndex];
  }

  nextImage(): void {
    if (!this.selectedImageUrl || this.imageList.length <= 1) {
      return;
    }
    const currentIndex = this.imageList.indexOf(this.selectedImageUrl);
    const nextIndex = currentIndex < this.imageList.length - 1 ? currentIndex + 1 : 0;
    this.selectedImageUrl = this.imageList[nextIndex];
  }

  goBack() {
    this.backToList.emit();   // 👈 send event to parent
  }
}
