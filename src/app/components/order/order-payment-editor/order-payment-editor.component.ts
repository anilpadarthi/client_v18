import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { OrderService } from '../../../services/order.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-payment-editor',
  templateUrl: './order-payment-editor.component.html',
  styleUrl: './order-payment-editor.component.scss'
})

export class OrderPaymentEditorComponent implements OnInit {

  form!: FormGroup;
  public url: any = null;
  selectedfile: any;
  selectedAmountType: any;
  selectedTax: any;
  isVatAmount = true;
  isFullAmount = true;


  ngOnInit(): void {
    
  }

}
