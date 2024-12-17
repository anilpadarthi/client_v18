import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { PostcodeService } from '../../../services/postcode.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-shop-editor',
  templateUrl: './shop-editor.component.html',
  styleUrl: './shop-editor.component.scss'
})

export class ShopEditorComponent {
  shopForm: FormGroup;
  shopId: any;
  areaLookup: any = [];
  @Input() selectedShopId!: number
  shopImagePreview: string | ArrayBuffer | null = null;
  filteredPostcodes!: Observable<string[]>;
  postCodeList: string[] = [];

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private shopService: ShopService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      private postcodeService: PostcodeService
    ) {

    this.shopForm = this.fb.group({
      shopId: 0,
      areaId: ['', [Validators.required]],
      postCode: ['', [Validators.required]],
      shopName: ['', [Validators.required]],
      vatNumber: [''],
      topupSystemId: [''],
      city: [''],
      address: ['', [Validators.required]],
      paymentMode: [''],
      payableName: [''],
      deliveryInstructions: [''],
      comments: [''],
      isMobileShop: false,
      shopImage: null as File | null,
      agreementFrom: [''],
      agreementTo: [''],
      agreementNotes: [''],
      isTermsAndCondtions: false,
      shopContacts: this.fb.array([this.createChild()]),
      status: true
    });
  }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id');
    if (this.selectedShopId) {
      this.shopId = this.selectedShopId;
    }
    this.getAreaRoleLookup();
    this.getShopDetails();

    this.shopForm.get('postCode')?.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after typing
      distinctUntilChanged(), // Prevent duplicate API calls
      switchMap(value => this.postcodeService.searchPostcodes(value))
    )
      .subscribe(response => {
        this.postCodeList = response;
      });
  }

  getAreaRoleLookup(): void {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });
  }

  getShopDetails() {
    if (this.shopId) {
      this.shopService.getShop(this.shopId).subscribe((res) => {
        this.shopForm.patchValue(res.data.shop);
        this.shopForm.get('agreementFrom')?.setValue(res.data.shopAgreement?.fromDate);
        this.shopForm.get('agreementTo')?.setValue(res.data.shopAgreement?.toDate);
        this.shopForm.get('agreementNotes')?.setValue(res.data.shopAgreement?.agreementNotes);
        this.populateShopContacts(res.data.shopContacts || []);
      });
    }
  }

  populateShopContacts(contacts: any[]): void {
    const contactFormArray = this.shopForm.get('shopContacts') as FormArray;
    contactFormArray.clear();
    contacts.forEach(contact => {
      contactFormArray.push(this.loadChild(contact));
    });
    this.shopForm.setControl('shopContacts', contactFormArray);
  }

  onSave() {
    if (this.shopForm.valid) {
      const requestBody = {
        "shopId": this.shopId != null ? this.shopId : 0,
        "shopName": this.shopForm.value.shopName,
        "postCode": this.shopForm.value.postCode,
        "areaId": this.shopForm.value.areaId,
        "address": this.shopForm.value.address,
        "city": this.shopForm.value.city,
        "vatNumber": this.shopForm.value.vatNumber,
        "paymentMode": this.shopForm.value.paymentMode,
        "payableName": this.shopForm.value.payableName,
        "deliveryInstructions": this.shopForm.value.deliveryInstructions,
        "topupSystemId": this.shopForm.value.topupSystemId,
        "comments": this.shopForm.value.comments,
        "isMobileShop": this.shopForm.value.isMobileShop,
        "agreementFrom": this.shopForm.value.agreementFrom,
        "agreementTo": this.shopForm.value.agreementTo,
        "agreementNotes": this.shopForm.value.agreementNotes,
        "isTermsAndCondtions": this.shopForm.value.isTermsAndCondtions,
        "shopContacts": this.shopForm.value.shopContacts,
        "status": this.shopForm.value.status ? 1 : 0,
      };

      if (this.shopId != null) {
        this.shopService.updateShop(requestBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            if (!this.selectedShopId) {
              this.router.navigate(['/shops']);
            }
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.shopService.createShop(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/shops']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/shops']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.shopForm.patchValue({
        passportImage: file,
      });
    }
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (field == "ShopImage") {
        this.shopForm.value.userImage = file;
        if (this.shopForm.value.userImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.shopImagePreview = reader.result; // Store the base64 string for preview
          };
          reader.readAsDataURL(file); // Convert image to base64 for preview
        }
      }
      console.log(file);
      // Do something with the file
    }
  }

  loadChild(contactData: any = {}): FormGroup {
    return this.fb.group({
      shopContactId: contactData.shopContactId,
      contactType: [contactData.contactType, [Validators.required]],
      contactName: [contactData.contactName, Validators.required],
      contactEmail: [contactData.contactEmail, Validators.required],
      contactNumber: [contactData.contactNumber, Validators.required],
    });
  }

  createChild(): FormGroup {
    return this.fb.group({
      shopContactId: 0,
      contactType: ['', [Validators.required]],
      contactName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactNumber: ['', Validators.required],
    });
  }

  get shopContacts(): FormArray {
    return <FormArray>this.shopForm.get('shopContacts');
  }

  addContact() {
    this.shopContacts.push(this.createChild());
  }

  removeContact(index: number) {
    this.shopContacts.removeAt(index);
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

}
