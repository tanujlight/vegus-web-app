import {Component, Input} from '@angular/core'
import {ViewCell} from 'ng2-smart-table'
import {Router} from '@angular/router'

@Component({
  template: ` <a href="javascript:void(0)" (click)="navigateTo(value.link)">{{ value?.title }}</a> `
})
export class LinkRenderComponent implements ViewCell {
  @Input() value: any
  @Input() rowData: any // Add the rowData property

  constructor(private router: Router) {}

  navigateTo(url: string) {
    this.router.navigateByUrl(url)
  }
}
