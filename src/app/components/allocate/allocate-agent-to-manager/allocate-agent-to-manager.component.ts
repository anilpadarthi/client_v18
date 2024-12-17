import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-allocate-agent-to-manager',
  templateUrl: './allocate-agent-to-manager.component.html',
  styleUrl: './allocate-agent-to-manager.component.scss'
})

export class AllocateAgentToManagerComponent {
  assignShopsForm: FormGroup;
  availableShops = [
    { id: 1, name: 'Shop A' },
    { id: 2, name: 'Shop B' },
    { id: 3, name: 'Shop C' },
    { id: 4, name: 'Shop D' },
    { id: 5, name: 'Shop E' }
  ];

  constructor(private fb: FormBuilder) {
    this.assignShopsForm = this.fb.group({
      userId: ['', Validators.required],
      shops: this.fb.array([], Validators.required),
    });
  }

  // Get form control for shops (this is a FormArray)
  get shops() {
    return (this.assignShopsForm.get('shops') as FormArray);
  }

  // Handle shop selection change
  onShopChange(event: any) {
    const selectedShops = event.value;
    const shopFormArray = this.shops;

    // Clear the previous selected shops
    while (shopFormArray.length) {
      shopFormArray.removeAt(0);
    }

    // Add the selected shops to the form array
    selectedShops.forEach((shopId: number) => {
      shopFormArray.push(this.fb.control(shopId));
    });
  }

  // Submit the form
  onSubmit() {
    if (this.assignShopsForm.valid) {
      const formValue = this.assignShopsForm.value;
      // You can now send formValue to your backend API
      console.log('Assigned Shops:', formValue);
      // Example: send the form data to the API
      // this.shopService.assignShopsToUser(formValue).subscribe(response => {
      //   console.log('Shops assigned successfully');
      // });
    }
  }
}
