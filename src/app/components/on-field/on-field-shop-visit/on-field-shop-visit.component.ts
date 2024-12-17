import { Component, Input, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-on-field-shop-visit',
  templateUrl: './on-field-shop-visit.component.html',
  styleUrl: './on-field-shop-visit.component.scss'
})

export class OnFieldShopVisitComponent {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  form!: FormGroup;
  capturedImage: string | null = null;
  @Input() selectedShopId!: number;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      image: [null, Validators.required]
    });
  }

  onCaptureImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ image: file });
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
    }
  }

  // Prepare the image for upload
  uploadImage() {
    if (this.capturedImage) {
      const formData = new FormData();
      formData.append('image', this.dataURItoBlob(this.capturedImage), 'captured-image.png');

      // Call your upload API here
      // this.http.post('your-api-endpoint', formData).subscribe(response => {
      //   console.log('Image uploaded successfully', response);
      // });
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
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('image', this.form.get('image')?.value);

      console.log('Captured Image FormData:', formData);
      // Perform API submission here
    }
  }

  closeDialog(): void {

  }


}