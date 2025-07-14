import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { PostcodeService } from '../../../services/postcode.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shop-editor',
  templateUrl: './shop-editor.component.html',
  styleUrl: './shop-editor.component.scss'
})

export class ShopEditorComponent {
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
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
    }
    this.shopId = this.route.snapshot.paramMap.get('id');
    if (this.selectedShopId) {
      this.shopId = this.selectedShopId;
    }
    this.getAreaRoleLookup();
    this.shopImagePreview = '/assets/images/profile/user-1.jpg';
    this.getShopDetails();
    //this.shopForm.get('latitude')?.disable();
    //this.shopForm.get('longitude')?.disable();
    if (environment.isAddressSearch) {
      this.shopForm.get('postCode')?.valueChanges.pipe(
        debounceTime(300), // Wait 300ms after typing
        distinctUntilChanged(), // Prevent duplicate API calls
        filter((value: any) => value && value.trim().length > 0),
        switchMap(value => this.postcodeService.autoCompletePostCodeList(value))
      )
        .subscribe(response => {
          this.postCodeList = response;
        });


      // this.shopForm.get('searchAddress')?.valueChanges.pipe(
      //   debounceTime(300), // Wait 300ms after typing
      //   distinctUntilChanged(), // Prevent duplicate API calls
      //   filter((value: any) => value && value.trim().length > 1),
      //   switchMap(value => this.postcodeService.autoCompleteAddresList(value))
      // ).subscribe((response: any) => {
      //   this.addressSuggestions = response.suggestions;
      // });

      this.shopForm.get('searchAddress')?.valueChanges.pipe(
        debounceTime(300), // Wait 300ms after typing
        distinctUntilChanged(), // Prevent duplicate API calls
        filter((value: any) => value && value.trim().length > 1),
        switchMap((value: any) => this.filterAddressList(value))
      ).subscribe((response: any) => {
        this.addressSuggestions = response;
      });
    }

    this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
  }

  populatePostCodeAddressList(): void {
    if (environment.isAddressSearch) {
      if (this.shopForm.value.postCode != null && this.shopForm.value.postCode != '') {
        this.postcodeService.autoCompleteAddresList(this.shopForm.value.postCode).subscribe((response: any) => {
          let addressSuggestions = response.suggestions;
          this.apiAddressSuggestions = addressSuggestions;
          this.addressSuggestions = addressSuggestions;
        });
      }
      else {
        this.toasterService.showMessage("please enter valid postcode");
      }
    }
  }

  filterAddressList(value: any): any {
    let filteredResults = this.apiAddressSuggestions.filter((f: any) => f.address.includes(value));
    return of(filteredResults);
  }

  private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAreaRoleLookup(): void {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
      this.filteredAreas = res.data;
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
              this.router.navigate(['/shops']);
            }
            else {
              const parentData = {
                data: res.data,
                fromAction: 'Shop'
              }
              this.notifyParent.emit(parentData);
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
    if (!this.selectedShopId) {
      this.router.navigate(['/shops']);
    }
    else {
      this.notifyParent.emit(null);
    }
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

  // onAutoCompleteAddress(): void {
  //   if (this.searchAddress.length > 2) { // Trigger search only if input length > 2
  //     this.postcodeService.autoCompleteAddresList(this.searchAddress).subscribe(
  //       (response) => {
  //         this.suggestions = response.suggestions.map((s: any) => s.address);
  //       },
  //       (error) => {
  //         console.error('Error fetching postcodes:', error);
  //         this.suggestions = [];
  //       }
  //     );
  //   } else {
  //     this.suggestions = [];
  //   }
  // }

  selectSuggestion(item: any): void {

    this.postcodeService.getAddressDetails(item.id).pipe(
      catchError(error => {
        this.toasterService.showMessage('Error fetching postcodes:');
        // Optionally show an error message to the user
        return of(null); // Return a fallback observable
      })
    ).subscribe((res) => {
      if (res) {
        this.shopForm.get('addressLine1')?.setValue(item.address);
        this.shopForm.get('addressLine2')?.setValue(res.line_3);
        this.shopForm.get('city')?.setValue(res.town_or_city);
        this.shopForm.get('latitude')?.setValue(res.latitude);
        this.shopForm.get('longitude')?.setValue(res.longitude);
        this.shopForm.get('searchAddress')?.setValue(item.address);
        // this.addressSuggestions = [];
      }
    });

  }

  sendActivationEmail(): void {
    this.shopService.sendActivationEmail(this.shopId).subscribe((res) => {
      if(res.statusCode == 200 ){
        this.toasterService.showMessage("Action email has been sent.");
      }
      else {
        this.toasterService.showMessage(res.message);
      }
    });
  }

}
