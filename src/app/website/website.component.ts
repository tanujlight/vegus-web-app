import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-website',
  styleUrls: ['./website.component.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-website-header></ngx-website-header>
      </nb-layout-header>

      <nb-layout-column>
        <router-outlet></router-outlet>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-website-footer></ngx-website-footer>
      </nb-layout-footer>
    </nb-layout>
  `
})
export class WebsiteComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
