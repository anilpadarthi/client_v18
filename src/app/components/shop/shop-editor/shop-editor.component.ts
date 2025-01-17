import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { PostcodeService } from '../../../services/postcode.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
  shopImagePreview: any = null;
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
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      paymentMode: [''],
      payableName: [''],
      competitor: [''],
      language: [''],
      deliveryInstructions: [''],
      comments: [''],
      isMobileShop: false,
      agreementFrom: [null],
      agreementTo: [null],
      agreementNotes: [null],
      isTermsAndCondtions: false,
      shopContacts: this.fb.array([this.createChild()]),
      status: true,
      image: null as File | null,
    });
  }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id');
    if (this.selectedShopId) {
      this.shopId = this.selectedShopId;
    }
    this.getAreaRoleLookup();
    this.shopImagePreview = '/assets/images/profile/user-1.jpg';
    this.getShopDetails();

    this.shopForm.get('postCode')?.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after typing
      distinctUntilChanged(), // Prevent duplicate API calls
      filter((value: any) => value && value.trim().length > 0),
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
        if (res.data?.shop?.image) {
          this.shopImagePreview = environment.backend.host + '/' + res.data?.shop?.image;
        }
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
      const formBody = new FormData();
      formBody.append('shopId', this.shopId != null ? this.shopId : 0);
      formBody.append('shopName', this.shopForm.value.shopName);
      formBody.append('postCode', this.shopForm.value.postCode);
      formBody.append('areaId', this.shopForm.value.areaId);
      formBody.append('addressLine1', this.shopForm.value.addressLine1);
      formBody.append('addressLine2', this.shopForm.value.addressLine2 || '');
      formBody.append('city', this.shopForm.value.city || '');
      formBody.append('vatNumber', this.shopForm.value.vatNumber || '');
      formBody.append('competitor', this.shopForm.value.competitor || '');
      formBody.append('language', this.shopForm.value.language || '');
      formBody.append('paymentMode', this.shopForm.value.paymentMode || '');
      formBody.append('payableName', this.shopForm.value.payableName || '');
      formBody.append('deliveryInstructions', this.shopForm.value.deliveryInstructions || '');
      formBody.append('topupSystemId', this.shopForm.value.topupSystemId || '');
      formBody.append('comments', this.shopForm.value.comments || '');
      formBody.append('isMobileShop', this.shopForm.value.isMobileShop);
      formBody.append('isTermsAndCondtions', this.shopForm.value.isTermsAndCondtions);
      formBody.append('status', this.shopForm.value.status ? '1' : '0');


      // Handle array fields like shopContacts
      if (this.shopForm.value.shopContacts && Array.isArray(this.shopForm.value.shopContacts)) {
        this.shopForm.value.shopContacts.forEach((contact: any, index: number) => {
          formBody.append(`shopContacts[${index}].shopContactId`, contact.shopContactId);
          formBody.append(`shopContacts[${index}].contactType`, contact.contactType);
          formBody.append(`shopContacts[${index}].contactName`, contact.contactName);
          formBody.append(`shopContacts[${index}].contactEmail`, contact.contactEmail);
          formBody.append(`shopContacts[${index}].contactNumber`, contact.contactNumber);
        });

      }

      // If there's a file field (e.g., image), append it
      if (this.shopForm.value.image) {
        formBody.append('imageFile', this.shopForm.value.image);
      }
      if (this.shopForm.value.agreementFrom && this.shopForm.value.agreementTo) {
        formBody.append('agreementFrom', this.shopForm.value.agreementFrom);
        formBody.append('agreementTo', this.shopForm.value.agreementTo);
        formBody.append('agreementNotes', this.shopForm.value.agreementNotes);
      }

      if (this.shopId != null) {
        this.shopService.updateShop(formBody).subscribe((res) => {
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
        this.shopService.createShop(formBody).subscribe((res) => {
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


  imageUpload(event: any) {
    var file = event.target.files[0];
    this.shopForm.patchValue({ image: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.shopImagePreview = event?.target?.result;
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
  pickAddress(): void {

  }

}
