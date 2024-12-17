import { Component, OnInit, Input } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-given-vs-activations',
  templateUrl: './on-field-given-vs-activations.component.html',
  styleUrl: './on-field-given-vs-activations.component.scss'
})

export class OnFieldGivenVsActivationsComponent implements OnInit {
  searchText: any;
  displayedColumns: string[] = [
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFGAF',
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
    'GIFGAF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
  ];

  givenList: any = [];
  activationList: any = [];
  mergedDataSource: any = [];
  dynamicColumns:string[] = [];


  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const request = {
      shopId: 30222,
      fromDate: '2024-01-01',
      toDate: '2024-09-01',
      activationType: 'D',
    };
    this.onFieldService.onFieldGivenVSActivationList(request).subscribe((res) => {
      const result = res.data;
      this.givenList = result[0];
      this.activationList = result[1];

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
      this.dynamicColumns =  Object.keys(this.mergedDataSource[0]);
    });
  }

  ngOnChanges(): void {
    this.loadData();
  }

}