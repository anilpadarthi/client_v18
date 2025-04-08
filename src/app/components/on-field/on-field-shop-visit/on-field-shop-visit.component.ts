import { Component, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { ToasterService } from '../../../services/toaster.service';
import { PostcodeService } from '../../../services/postcode.service';

@Component({
  selector: 'app-on-field-shop-visit',
  templateUrl: './on-field-shop-visit.component.html',
  styleUrl: './on-field-shop-visit.component.scss'
})

export class OnFieldShopVisitComponent {

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef;
  capturedImage: string | null = null;
  comments: any = null;
  selectedShopId: any = null;
  @Input() geoLocation: any;
  @Input() shopAddressDetails: any = null;
  @Input() refreshValue!: number;
  @Output() notifyParent = new EventEmitter<any>();
  stream!: MediaStream;

  constructor(private fb: FormBuilder,
    private shopService: ShopService,
    private toasterService: ToasterService,
    private postcodeService: PostcodeService,
  ) {
    this.capturedImage = '/assets/images/profile/user-1.jpg';
    this.selectedShopId = this.shopAddressDetails?.shopId;
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.capturedImage = canvas.toDataURL('image/png'); // Convert to base64
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }






  // Convert Data URL to Blob
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/png' });
  }

  onSubmit(): void {
    if (this.selectedShopId) {
      this.postcodeService.getDistanceBetweenLatAndLong(this.geoLocation.latitude, this.geoLocation.longitude,
        this.shopAddressDetails.latitude, this.shopAddressDetails.longitude).subscribe((res) => {
          console.log(res);
          if (res.metres < 300) {
            this.proceedToShopVisit();
          }
          else {
            this.toasterService.showMessage('You are not allowd to scan sims for this shop, for this location.')
          }
        });
    }
  }

  onClear(): void {
    this.comments = null;
  }

  proceedToShopVisit(): void {
    if (!this.capturedImage) {
      alert('Please capture an image first!');
      return;
    }

    const blob = this.dataURItoBlob(this.capturedImage);
    const formData = new FormData();
    formData.append('shopId', this.selectedShopId != null ? this.selectedShopId : 0);
    formData.append('comments', this.comments);
    formData.append('latitude', this.geoLocation.latitude);
    formData.append('longitude', this.geoLocation.longitude);
    formData.append('imageFile', blob, 'captured-image.png');


    this.shopService.creteShopVisit(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Visited successfully.");
        this.comments = null;
        this.capturedImage = null;
        const parentData = {
          fromAction: 'ShopVisit'
        }
        this.notifyParent.emit(parentData);
      }
    });
  }

  ngOnChanges(): void {
    this.selectedShopId = this.shopAddressDetails?.shopId;
  }


}