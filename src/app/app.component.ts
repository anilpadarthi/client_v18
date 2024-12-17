import { Component, LOCALE_ID  } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../app/services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-GB' } // Set locale globally to 'en-GB' for GBP
  ]
})


export class AppComponent {
  title = 'Leap-Tel';
  isLoading$!: Observable<boolean>;

  constructor(private loaderService: SpinnerService) { }

  ngOnInit(): void {
    this.isLoading$ = this.loaderService._loading;
  }
}
