/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, Input} from '@angular/core'
import {DomSanitizer, SafeHtml} from '@angular/platform-browser'

@Component({
  selector: 'ngx-sanatize-html-string',
  template: `
    <div
      class="sanitize-html-container"
      style="word-wrap: break-word; text-align: justify;"
      [innerHtml]="sanitizeHtml(htmlString)"
    ></div>
  `,
  styleUrls: ['./sanatize-html-string.component.scss']
})
export class NgxSanatizeHtmlStringComponent {
  @Input() htmlString: string = ''

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
