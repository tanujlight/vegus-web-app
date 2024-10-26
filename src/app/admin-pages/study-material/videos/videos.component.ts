import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-videos',
  template: ` <router-outlet></router-outlet> `
})
export class VideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
