/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component} from '@angular/core'

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="footer-container">
      <!-- <span class="created-by">Created with ♥ by <b>Tanuj</b> {{ currentYear }}</span> -->
      <!-- <span class="created-by">Copyright All Rights Reserved ©  Vegus</span> -->
      <span class="created-by">Vegus © {{ currentYear }} All Rights Reserved</span>
      <!-- <div class="links">
        <a [routerLink]="['/home']">Home</a>
        <a [routerLink]="['/about-us']">About Us</a>
        <a [routerLink]="['/terms-and-conditions']">Terms & Conditions</a>
        <a [routerLink]="['/privacy-policy']">Privacy Policy</a>
        <a [routerLink]="['/refund-policy']">Refund Policy</a>
      </div> -->
    </div>
  `
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear()
  }
}

// <a href="https://akveo.com" target="_blank">Akveo</a></b> {{ currentYear }}</span>
