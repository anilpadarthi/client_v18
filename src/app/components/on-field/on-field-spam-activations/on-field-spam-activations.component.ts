import { Component, OnInit, Input } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-spam-activations',
  templateUrl: './on-field-spam-activations.component.html',
  styleUrl: './on-field-spam-activations.component.scss'
})

export class OnFieldSpamActivationsComponent implements OnInit {
  @Input() selectedShopId!: number;
  activationList: any = [];
  displayedColumns: string[] = [
    'DATE',
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService,
  ) { }

  ngOnInit(): void {
    if (this.selectedShopId > 0) {
      this.loadData();
    }
  }

  loadData(): void {
    const request = {
      shopId: this.selectedShopId,
      isInstantActivation: true,
      isSpam: true,
    };
    this.onFieldService.onFieldActivationList(request).subscribe((res) => {
      this.activationList = res.data;
    });
  }
  ngOnChanges(): void {
    this.loadData();
  }

}
