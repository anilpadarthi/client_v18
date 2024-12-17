
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss'
})

export class EditUserProfileComponent {
  userForm: FormGroup;
  userId: any;
  userRoleLookup: any = [];
  documentTypeLookUp = [
    { "id": "Driving Licence", "name": "Driving Licence" },
    { "id": "Passport", "name": "Passport" },
    { "id": "Visa", "name": "Visa" },
    { "id": "Other", "name": "Other" },
  ];
  userImagePreview: string | ArrayBuffer | null = null;
  selectedUserImage: any;
  public userImageUrl: any = null;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private webstorgeService: WebstorgeService,
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
      userImage: null as File | null,
      userDocuments: this.fb.array([this.createChild()]),
    });
  }

  ngOnInit(): void {
    this.userId = this.webstorgeService.getUserInfo().userId;
    this.getUserRoleLookup();
    this.getUserDetails();
  }

  getUserRoleLookup(): void {
    this.lookupService.getUserRoles().subscribe((res) => {
      this.userRoleLookup = res.data;
    });
  }

  getUserDetails() {
    if (this.userId || this.userId == 0) {
      this.userService.getUser(this.userId).subscribe((res) => {
        this.userForm.patchValue(res.data.user);
        this.userImageUrl = environment.backend.host + '/' + res.data.user?.userImage;
        this.populateUserDocuments(res.data.userDocuments || []);
      });
    }
  }

  populateUserDocuments(userDocuments: any[]): void {
    const documentFormArray = this.userForm.get('userDocuments') as FormArray;
    documentFormArray.clear();
    userDocuments.forEach(e => {
      documentFormArray.push(this.loadChild(e));
    });
    this.userForm.setControl('userDocuments', documentFormArray);
  }


  onSave() {
    if (this.userForm.valid) {
      this.userForm.value.userDocuments?.forEach((e: any) => {
        e.validFrom = this.datePipe.transform(e.validFrom, 'yyyy-MM-dd');
        e.validTo = this.datePipe.transform(e.validTo, 'yyyy-MM-dd');
        e.documentImage = e.documentImage != null ? e.documentImage : ''
      });

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
      formBody.append('userImageFile', this.selectedUserImage);
      formBody.append('userDocuments', this.userForm.value.userDocuments);


      if (this.userId != null) {
        this.userService.updateUser(formBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/users']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.toasterService.showMessage("Something went wrong.");
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.selectedUserImage = file;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.userImageUrl = event?.target?.result;
    }
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
      documentImage: [''],
    })
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

}
