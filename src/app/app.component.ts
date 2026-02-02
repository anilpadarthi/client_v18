import { Component, LOCALE_ID  } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../app/services/spinner/spinner.service';
import { AuthService } from './services/auth.service';
import { IdleService } from './services/idle.service';

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


  constructor(private authService: AuthService, private loaderService: SpinnerService, private idleService: IdleService) {
   
  }

  ngOnInit(): void {
    this.isLoading$ = this.loaderService._loading;
    // ✅ Start watching if already logged in
    if (this.authService.isAuthenticated()) {
      this.idleService.startWatching();
    }

     // ✅ Subscribe to timeout event
    this.idleService.onTimeout.subscribe(() => {
      alert("Session expired due to inactivity!");
      this.authService.logout();
    });
  }
}
