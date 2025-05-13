import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
    <a href="/home">
        <img
          src="./assets/images/logos/Leap.png"
          class="align-middle leap-logo"
          alt="logo"
        />
      </a>
      <a href="/home">
        <img
          src="./assets/images/logos/Favicon.png"
          class="align-middle leap-logo mobile-logo"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() { }
}