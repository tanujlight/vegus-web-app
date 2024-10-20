import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-explanation',
  templateUrl: './explanation.component.html'
})
export class ExplanationComponent {
  @Input() explanation: string

  constructor() {}
}
