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

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  capturedImage: string | null = null;
  liveImage: any = null;
  comments: any = null;
  selectedShopId: any = null;
  @Input() geoLocation: any;
  @Input() shopAddressDetails: any = null;
  @Input() refreshValue!: number;
  @Output() notifyParent = new EventEmitter<string>();

  constructor(private fb: FormBuilder,
    private shopService: ShopService,
    private toasterService: ToasterService,
    private postcodeService: PostcodeService,
  ) {
    this.capturedImage = '/assets/images/profile/user-1.jpg';
    this.selectedShopId = this.shopAddressDetails?.shopId;
  }

  onCaptureImage(event: any): void {
    const file = event.target.files[0];
    this.liveImage = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }

  // Capture the image from the video stream
  captureImage() {
    const canvas = document.createElement('canvas');
    const video = this.videoElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/png');  // Convert to base64 string
      this.liveImage = this.capturedImage;
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
    const formData = new FormData();
    formData.append('shopId', this.selectedShopId != null ? this.selectedShopId : 0);
    formData.append('comments', this.comments);
    formData.append('imageFile', this.liveImage);
    formData.append('latitude', this.geoLocation.latitude);
    formData.append('longitude', this.geoLocation.longitude);

    console.log('Captured Image FormData:', formData);

    this.shopService.creteShopVisit(this.selectedShopId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Visited successfully.");
        this.comments = null;
        this.capturedImage = null;
        this.liveImage = null;
        this.notifyParent.emit();
      }
    });
  }


}