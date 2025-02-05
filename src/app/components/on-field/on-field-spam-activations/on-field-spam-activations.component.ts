import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-spam-activations',
  templateUrl: './on-field-spam-activations.component.html',
  styleUrl: './on-field-spam-activations.component.scss'
})

export class OnFieldSpamActivationsComponent implements OnInit {
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  private isFirstChange = true;
  isLoading = false;
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
    this.isLoading = true;
    const request = {
      shopId: this.selectedShopId,
      isInstantActivation: true,
      isSpam: true,
    };
    this.onFieldService.onFieldActivationList(request).subscribe((res) => {
      this.isLoading = false;
      if (res.data) {
        let result = res.data;
        result.forEach((e: any) => {
          e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
        });
        this.activationList = result;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false; // Mark first change as handled
      return; // Skip logic on the first change detection pass
    }

    if (changes['selectedShopId'] || changes['refreshValue']  ) {
      this.loadData();
    }
  }

}
