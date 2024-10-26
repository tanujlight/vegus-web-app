import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-questions',
  template: ` <router-outlet></router-outlet> `
})
export class QuestionsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
