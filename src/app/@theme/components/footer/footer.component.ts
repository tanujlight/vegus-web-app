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
    <!-- <span class="created-by">Created with ♥ by <b>Tanuj</b> {{ currentYear }}</span> -->
    <!-- <span class="created-by">Copyright All Rights Reserved ©  Vegus</span> -->
    <span class="created-by">Vegus © {{ currentYear }} All Rights Reserved</span>
    <!-- <div class="socials">
      <a href="#" target="_blank" class="ion ion-social-github"></a>
      <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
    </div> -->
  `
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear()
  }
}

// <a href="https://akveo.com" target="_blank">Akveo</a></b> {{ currentYear }}</span>
