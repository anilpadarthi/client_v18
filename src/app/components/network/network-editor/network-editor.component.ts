import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from '../../../services/network.service';
import { ToasterService } from '../../../services/toaster.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-network-editor',
  templateUrl: './network-editor.component.html',
  styleUrl: './network-editor.component.scss'
})

export class NetworkEditorComponent {

  networkForm: FormGroup;
  networkId: any;
  networkCodesLookup: any = [];
  supplierLookup: any = [];

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private networkService: NetworkService,
      private lookupService: LookupService,
      private toasterService: ToasterService,
      private fb: FormBuilder
    ) {

    this.networkForm = this.fb.group(
      {
        baseNetworkId: [null, [Validators.required]],
        supplierId: [null, [Validators.required]],        
        networkName: ['', [Validators.required, Validators.minLength(2)]],
        skuCode: ['', [Validators.required]],
        status: [true],
      },
    );
  }

  ngOnInit(): void {
    this.loadNetworkCodeLookup();
    this.loadSupplierLookup();
    this.networkId = this.route.snapshot.paramMap.get('id');
    this.getNetworkDetails();
  }

  loadNetworkCodeLookup(): void {
    this.lookupService.getNetowrks().subscribe((res) => {
      this.networkCodesLookup = res.data;
    });
  }

  loadSupplierLookup(): void {
    this.lookupService.getSuppliers().subscribe((res) => {
      this.supplierLookup = res.data;
    });
  }

  getNetworkDetails() {
    if (this.networkId) {
      this.networkService.getNetwork(this.networkId).subscribe((res) => {
        this.networkForm.patchValue(res.data);
      });
    }
  }

  onSave() {
    if (this.networkForm.valid) {
      const requestBody = {
        "networkId": this.networkId != null ? this.networkId : 0,
        "baseNetworkId": this.networkForm.value.baseNetworkId,
        "supplierId": this.networkForm.value.supplierId,
        "networkCode": this.networkCodesLookup.find((option: any) => option.id === this.networkForm.value.baseNetworkId).name,
        "networkName": this.networkForm.value.networkName.trim(),
        "skuCode": this.networkForm.value.skuCode.trim(),
        "status": this.networkForm.value.status ? 1 : 0
      };

      if (this.networkId != null) {
        this.networkService.updateNetwork(requestBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.router.navigate(['/networks']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.networkService.createNetwork(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.router.navigate(['/networks']);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/networks']);
  }
  
}