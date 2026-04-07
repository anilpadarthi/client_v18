import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WebstorgeService } from '../../services/web-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  userRole: string | null = null;
  constructor(private authService: AuthService, private webstorgeService: WebstorgeService) { 

     if(this.authService.isTokenExpired()) {
      this.authService.logout();
      return;
     }

      this.userRole = this.webstorgeService.getUserRole();

  }


}
