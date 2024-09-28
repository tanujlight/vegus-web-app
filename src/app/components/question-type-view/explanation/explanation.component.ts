import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-explanation',
  templateUrl: './explanation.component.html'
})
export class ExplanationComponent implements OnInit {
  @Input() explanation: string

  constructor() {}

  ngOnInit(): void {}
}
