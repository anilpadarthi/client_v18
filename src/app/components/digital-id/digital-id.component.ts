import { Component } from '@angular/core';
import { WebstorgeService } from '../../services/web-storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-digital-id',
  templateUrl: './digital-id.component.html',
  styleUrl: './digital-id.component.scss'
})
export class DigitalIdComponent {

  userInfo: any;

  constructor(
      private webstorgeService: WebstorgeService,
    ) {
    }

  ngOnInit(): void {
    let userInfo = this.webstorgeService.getUserInfo();
    userInfo.userImage = environment.backend.host + '/' + userInfo.userImage;
    this.userInfo = userInfo;
  }

}
