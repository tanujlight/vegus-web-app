import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-notes',
  template: ` <router-outlet></router-outlet> `
})
export class NotesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
