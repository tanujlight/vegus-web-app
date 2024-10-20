import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core'

@Component({
  selector: 'category-subcategory-breadcrumbs',
  templateUrl: './category-subcategory-breadcrumbs.component.html',
  styleUrls: ['./category-subcategory-breadcrumbs.component.scss']
})
export class CategorySubcategoryBreadcrumbsComponent implements OnInit {
  @Input() category: any
  @Input() subCategory: any
  @Output() onSelectBreadcrumb = new EventEmitter<any>()
  breadcrumbs = ['Categories']

  constructor() {}

  ngOnInit(): void {
    if (this.category && this.subCategory) {
      this.breadcrumbs = ['Categories', this.category.name, 'Sub Categories', this.subCategory.name]
    }
  }

  onSelectBreadcrum(event, item: string) {
    if (item === 'Categories') {
      this.onSelectBreadcrumb.emit({})
    } else if (item === 'Sub Categories') {
      this.onSelectBreadcrumb.emit({
        category: this.category.id
      })
    } else {
      return event.preventDefault()
    }
  }
}
