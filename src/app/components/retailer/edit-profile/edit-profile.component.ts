import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { PostcodeService } from '../../../services/postcode.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})

export class EditProfileComponent {
  shopForm: FormGroup;
  shopId: any;
  areaLookup: any = [];
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  @Output() notifyParent = new EventEmitter<any>();
  shopImagePreview: any = null;
  filteredPostcodes!: Observable<string[]>;
  postCodeList: string[] = [];
  //searchAddress = '';
  addressSuggestions: any = [];
  apiAddressSuggestions: any = [];
  isDisplay = false;
  areaFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private shopService: ShopService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      private postcodeService: PostcodeService,
      private webstorgeService: WebstorgeService,
      private datePipe: DatePipe
    ) {

    this.shopForm = this.fb.group({
      shopId: 0,
      areaId: ['', [Validators.required]],
      searchAddress: [''],
      postCode: ['', [Validators.required]],
      shopName: ['', [Validators.required]],
      vatNumber: [''],
      topupSystemId: [''],
      city: [''],
      shopEmail: ['', [Validators.required, Validators.email]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      paymentMode: [''],
      payableName: [''],
      competitor: [''],
      language: [''],
      deliveryInstructions: [''],
      latitude: [{ value: '', disabled: true }],
      longitude: [{ value: '', disabled: true }],
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
    this.shopId = this.webstorgeService.getUserInfo().userId;
    this.shopImagePreview = '/assets/images/profile/user-1.jpg';
    this.getShopDetails();
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
      formBody.append('shopEmail', this.shopForm.value.shopEmail);
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
      formBody.append('latitude', this.shopForm.getRawValue().latitude || '');
      formBody.append('longitude', this.shopForm.getRawValue().longitude || '');
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
        formBody.append('agreementFrom', this.datePipe.transform(this.shopForm.value.agreementFrom, 'yyyy-MM-dd') || '');
        formBody.append('agreementTo', this.datePipe.transform(this.shopForm.value.agreementTo, 'yyyy-MM-dd') || '');
        formBody.append('agreementNotes', this.shopForm.value.agreementNotes);
      }

      if (this.shopId != null) {
        this.shopService.updateShop(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            if (!this.selectedShopId) {
              this.getShopDetails();
            }
            else {
              const parentData = {
                data: res.data,
                fromAction: 'Shop'
              }
              this.getShopDetails();
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
            this.getShopDetails();
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.getShopDetails();
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






}
