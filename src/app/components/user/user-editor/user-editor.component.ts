import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.scss'
})

export class UserEditorComponent {
  userForm: FormGroup;
  userId: any;
  userRoleLookup: any = [];
  documentTypeLookUp = [
    { "id": "Driving Licence", "name": "Driving Licence" },
    { "id": "Passport", "name": "Passport" },
    { "id": "Visa", "name": "Visa" },
    { "id": "Other", "name": "Other" },
  ];
  userImagePreview: any = null;
  documentPreviews: { index: number; preview: string | null }[] = [];

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      private datePipe: DatePipe
    ) {

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      doj: ['', [Validators.required]],
      address: ['', [Validators.required]],
      userRoleId: [null, [Validators.required]],
      designation: ['', [Validators.required]],
      nickName: ['', [Validators.required]],
      locality: [''],
      isMcomAccess: false,
      isLeapAccess: true,
      status: true,
      userImage: null as File | null,
      userDocuments: this.fb.array([]),
      userSalarySettings: this.createSalarySetting(),
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userImagePreview = '/assets/images/profile/user-1.jpg';
    this.getUserRoleLookup();
    this.getUserDetails();
  }

  getUserRoleLookup(): void {
    this.lookupService.getUserRoles().subscribe((res) => {
      this.userRoleLookup = res.data;
    });
  }

  getUserDetails() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((res) => {
        this.userForm.patchValue(res.data.user);
        if (res.data.user?.userImage) {
          this.userImagePreview = environment.backend.host + '/' + res.data.user?.userImage;
        }
        this.populateUserDocuments(res.data.userDocuments || []);
        this.populateUserSalarySettings(res.data.userSalarySettings);
      });
    }
  }

  populateUserDocuments(userDocuments: any[]): void {
    const documentFormArray = this.userForm.get('userDocuments') as FormArray;
    documentFormArray.clear();
    let documentIndex = 0;
    userDocuments.forEach(e => {
      if (e.documentImage) {
        e.documentImage = `${environment.backend.host}/${e.documentImage}`;
      }
      documentFormArray.push(this.loadChild(e));
      this.documentPreviews.push({ index: documentIndex, preview: e.documentImage as string });
      documentIndex++;
    });
    this.userForm.setControl('userDocuments', documentFormArray);
  }

  populateUserSalarySettings(userSalarySettings: any): void {
    if (userSalarySettings) {
      this.userForm.get('userSalarySettings')?.patchValue({
        salaryBasis: userSalarySettings.salaryBasis,
        salaryRate: userSalarySettings.salaryRate,          // 👈 Corrected
        travelType: userSalarySettings.travelType,
        travelRate: userSalarySettings.travelRate,
        effectiveDate: userSalarySettings.fromDate
      });
    }
  }


  onSave() {
    if (this.userForm.valid) {
      const formBody = new FormData();

      formBody.append('userId', this.userId != null ? this.userId : 0);
      formBody.append('firstName', this.userForm.value.firstName);
      formBody.append('lastName', this.userForm.value.lastName);
      formBody.append('userName', this.userForm.value.userName);
      formBody.append('email', this.userForm.value.email);
      formBody.append('mobile', this.userForm.value.mobile);
      formBody.append('password', this.userForm.value.password);
      formBody.append('gender', this.userForm.value.gender);
      formBody.append('dob', this.datePipe.transform(this.userForm.value.dob, 'yyyy-MM-dd') || '');
      formBody.append('doj', this.datePipe.transform(this.userForm.value.doj, 'yyyy-MM-dd') || '');
      formBody.append('address', this.userForm.value.address);
      formBody.append('locality', this.userForm.value.locality);
      formBody.append('designation', this.userForm.value.designation);
      formBody.append('nickName', this.userForm.value.nickName);
      formBody.append('userRoleId', this.userForm.value.userRoleId?.toString());
      formBody.append('isMcomAccess', this.userForm.value.isMcomAccess);
      formBody.append('isLeapAccess', this.userForm.value.isLeapAccess);
      formBody.append('status', this.userForm.value.status ? '1' : '0');
      formBody.append('userImageFile', this.userForm.value.userImage);
      formBody.append('userSalarySettings[salaryBasis]', this.userForm.value.userSalarySettings.salaryBasis);
      formBody.append('userSalarySettings[salaryRate]', this.userForm.value.userSalarySettings.salaryRate);
      formBody.append('userSalarySettings[travelType]', this.userForm.value.userSalarySettings.travelType);
      formBody.append('userSalarySettings[travelRate]', this.userForm.value.userSalarySettings.travelRate);
      formBody.append('userSalarySettings[fromDate]', this.userForm.value.userSalarySettings.effectiveDate);

      if (this.userForm.value.userDocuments && Array.isArray(this.userForm.value.userDocuments)) {
        this.userForm.value.userDocuments.forEach((doc: any, index: number) => {
          formBody.append(`userDocuments[${index}].validFrom`, this.datePipe.transform(doc.validFrom, 'yyyy-MM-dd') || '');
          formBody.append(`userDocuments[${index}].validTo`, this.datePipe.transform(doc.validTo, 'yyyy-MM-dd') || '');
          if (doc.documentImage instanceof File) {
            formBody.append(`userDocuments[${index}].documentImageFile`, doc.documentImage || '');
          }
          formBody.append(`userDocuments[${index}].documentType`, doc.documentType || '');
          formBody.append(`userDocuments[${index}].documentNumber`, doc.documentNumber || '');
        });
      }

      if (this.userId != null) {
        this.userService.updateUser(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Saved successfully.");
            this.router.navigate(['/users']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.userService.createUser(formBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Saved successfully.");
            this.router.navigate(['/users']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({
        passportImage: file,
      });
    }
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.userForm.patchValue({ userImage: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.userImagePreview = event?.target?.result;
    }
  }

  onDocumentImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    this.userDocuments.at(index).patchValue({ documentImage: file });
    const reader = new FileReader();
    reader.onload = () => {
      const previewIndex = this.documentPreviews.findIndex((p) => p.index === index);
      if (previewIndex !== -1) {
        this.documentPreviews[previewIndex].preview = reader.result as string;
      } else {
        this.documentPreviews.push({ index, preview: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  }

  getDocumentPreview(index: number): string | null {
    const preview = this.documentPreviews.find((p) => p.index === index);
    return preview ? preview.preview : null;
  }

  loadChild(userDocument: any = {}): FormGroup {
    return this.fb.group({
      userDocumentId: userDocument.userDocumentId,
      documentType: [userDocument.documentType, [Validators.required]],
      documentNumber: [userDocument.documentNumber, [Validators.required]],
      validFrom: [userDocument.validFrom, [Validators.required]],
      validTo: [userDocument.validTo, [Validators.required]],
      documentImage: [userDocument.documentImage],
    })
  }

  createChild(): FormGroup {
    return this.fb.group({
      userDocumentId: 0,
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      validFrom: ['', [Validators.required]],
      validTo: ['', [Validators.required]],
      documentImage: [null],
    })
  }

  createSalarySetting(): FormGroup {
    return this.fb.group({
      salaryBasis: [''],
      salaryRate: [''],
      travelType: [''],
      travelRate: [''],
      effectiveDate: ['']
    });
  }

  get userDocuments(): FormArray {
    return <FormArray>this.userForm.get('userDocuments');
  }

  addDocument() {
    this.userDocuments.push(this.createChild());
  }

  removeDocument(index: number) {
    this.userDocuments.removeAt(index);
  }

  // Handle Year Selection (no action needed)
  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

  // Handle Month Selection
  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.userForm.get('userSalarySettings.effectiveDate')?.setValue(formattedMonth + "-01");
    datepicker.close(); // Close picker after selection
  }

}
