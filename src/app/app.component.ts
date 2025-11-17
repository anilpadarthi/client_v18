import { Component, LOCALE_ID  } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../app/services/spinner/spinner.service';
import { AuthService } from './services/auth.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

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


  constructor(private idle: Idle, private auth: AuthService, private loaderService: SpinnerService) {
    // 3600 seconds = 1 hour idle timeout
    idle.setIdle(3600);
    idle.setTimeout(0);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.auth.logout();
      window.location.href = '/login';
    });

    idle.watch();
  }

  ngOnInit(): void {
    this.isLoading$ = this.loaderService._loading;
  }
}
