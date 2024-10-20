import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-reports',
  template: ` <router-outlet></router-outlet> `
})
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
