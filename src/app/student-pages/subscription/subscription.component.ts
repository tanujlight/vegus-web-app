import {Component, OnDestroy, OnInit, HostListener} from '@angular/core'

@Component({
  selector: 'ngx-subscription',
  template: ` <router-outlet></router-outlet>`
})
export class SubscriptionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
