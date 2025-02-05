import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-given-vs-activations',
  templateUrl: './on-field-given-vs-activations.component.html',
  styleUrl: './on-field-given-vs-activations.component.scss'
})

export class OnFieldGivenVsActivationsComponent implements OnInit {
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  private isFirstChange = true;
  searchText: any;
  isLoading = false;
  displayedColumns: string[] = [
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  givenListColumns: string[] = [
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
  ];

  givenList: any = [];
  activationList: any = [];
  mergedDataSource: any = [];
  dynamicColumns: string[] = [];


  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const request = {
      shopId: this.selectedShopId,
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      toDate: new Date(),
      activationType: 'D',
    };
    this.onFieldService.onFieldGivenVSActivationList(request).subscribe((res) => {
      this.isLoading = false;
      if (res.data?.length > 0) {
        const result = res.data;
        this.givenList = result[0];
        this.activationList = result[1];
        if (this.givenList.length > 0) {
          this.mergedDataSource = this.givenList.map((givenRow: any, index: any) => {
            const activatedRow = this.activationList[index];
            const mergedRow: any = { AssignedDate: givenRow.AssignedDate };

            // Merge "Given" and "Activated" columns for each network
            Object.keys(givenRow).forEach((key) => {
              if (key !== 'AssignedDate') {
                mergedRow[`${key}_Given`] = givenRow[key] ?? 0;
                mergedRow[`${key}_Activated`] = activatedRow[key] ?? 0;
              }
            });

            return mergedRow;

          });
          this.dynamicColumns = Object.keys(this.mergedDataSource[0]);
        }
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