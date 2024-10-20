import { Component, OnInit } from '@angular/core';
import {NbSidebarService} from '@nebular/theme'

@Component({
  selector: 'ngx-plans',
  template: ` <router-outlet></router-outlet> `
})
export class PlansComponent implements OnInit {
  constructor(private sidebarService: NbSidebarService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sidebarService.compact('menu-sidebar')
    }, 100)
  }

}
