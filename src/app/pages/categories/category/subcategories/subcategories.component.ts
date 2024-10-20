import {Component, Input, OnInit} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

import {SubCategory} from '../../categories.interface'
import {CategoriesApi} from 'app/services/apis/categories.service'

@Component({
  selector: 'ngx-subcategories',
  templateUrl: './subcategories.component.html'
})
export class SubcategoriesComponent implements OnInit {
  @Input() categoryId: string

  @Input() subCategories: SubCategory[] = []

  tableColumns: any = {}

  tableSettings: any

  constructor(private categoriesApi: CategoriesApi, private toasterService: NbToastrService) {
    this.initializeTableColumns()
    this.initalizeTableSettings()
  }

  ngOnInit(): void {}

  private initalizeTableSettings() {
    this.tableSettings = {
      actions: {
        columnTitle: 'Actions',
        add: true,
        edit: true,
        delete: true
      }
    }
  }

  private initializeTableColumns() {
    this.tableColumns = {
      name: {
        title: 'Name',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true
      },
      // description: {
      //   title: 'Description',
      //   type: 'string',
      //   editable: true
      // }

      questions: {
        title: 'Questions',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          const url = `/pages/questions/list-view?category=${this.categoryId}&subCategory=${row.id}`
          return `<a href="${url}" target="_blank">Go To Questions</a>`
        }
      },
      caseStudies: {
        title: 'Case Studies',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          const url = `/pages/case-studies/list-view?category=${this.categoryId}&subCategory=${row.id}`
          return `<a href="${url}" target="_blank">Go To Case studies</a>`
        }
      }
    }
  }

  removeSubcategory(event: SubCategory) {
    this.categoriesApi.deleteSubCategory(this.categoryId, event.id).subscribe(res => {
      if (res) {
        this.subCategories = this.subCategories.filter(subCategory => subCategory.id !== event.id)
        this.toasterService.success('', 'Subcategory deleted successfully')
      }
    })
  }

  addSubCategory(event: SubCategory) {
    this.categoriesApi.addSubCategory(this.categoryId, event).subscribe(res => {
      if (res) {
        this.subCategories = [...this.subCategories, res]
        this.toasterService.success('', 'Subcategory added successfully')
      }
    })
  }

  updateSubcategory(event: SubCategory) {
    this.categoriesApi.updateSubCategory(this.categoryId, event).subscribe(res => {
      if (res) {
        this.subCategories = this.subCategories.map(subCategory => {
          if (subCategory.id === event.id) {
            subCategory = event
          }
          return subCategory
        })
        this.toasterService.success('', 'Subcategory updated successfully')
      }
    })
  }
}
