import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../../../../admin-pages/categories/categories.interface'
import {DatePipe} from '@angular/common'
import {TutuorService} from 'app/services/apis/tutuor.service'
import {TakeTestComponent} from '../take-test/take-test.component'

@Component({
  selector: 'ngx-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tableColumns: any = {}

  allCategories = []

  dataSource

  tableSettings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      type: 'html',
      custom: [
        {
          name: 'Take test',
          title: '<i class="nb-play" data-toggle="tooltip" data-placement="top" title="Take test"></i>'
        }
      ]
    }
  }

  constructor(
    private categoriesService: CategoriesApi,
    private tutuorService: TutuorService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.getCategoires()
    this.loadDataSource()
  }

  private loadDataSource() {
    this.dataSource = this.tutuorService.getPracticeTests()
  }

  private async getCategoires() {
    return this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.allCategories = categoires
      this.initializeTableColumns()
    })
  }

  private initializeTableColumns() {
    this.tableColumns = {
      // uniqueIdentifier: {
      //   title: 'ID',
      //   type: 'string',
      //   editable: false
      // },
      status: {
        title: 'Status',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select status',
            list: [
              {value: 'completed', title: 'Completed'},
              {value: 'resumed', title: 'Resumed'},
              {value: 'started', title: 'Started'},
              {value: 'suspended', title: 'Suspended'}
            ]
          }
        }
      },
      createdAt: {
        title: 'Date',
        type: 'string',
        filter: false,
        valuePrepareFunction: (createdAt: any) => {
          return new DatePipe('en-US').transform(createdAt, 'yyyy/MM/dd')
        }
      },
      totalMarks: {
        title: 'Scored/Max',
        type: 'string',
        filter: false,
        editable: false,
        valuePrepareFunction: (cell, row) => {
          const percentage = ((row.scoredMarks / row.totalMarks) * 100).toFixed(2)
          return `${row.scoredMarks}/${row.totalMarks} (${percentage}%)`
        }
      },
      noOfQuestions: {
        title: 'No of Questions',
        type: 'string',
        editable: false,
        filter: false
      },
      categories: {
        title: 'Categories',
        type: 'string',
        filter: false,
        editable: false,
        valuePrepareFunction: (cell, row) => {
          const categoires = row.categories.map(item => item.name)
          if (categoires.length === 0) {
            return '--'
          } else {
            if (categoires.length > 2) {
              return 'Multiple'
            } else {
              return `${categoires.join(', ')}`
            }
          }
        }
      },
      subcategories: {
        title: 'Sub Categories',
        type: 'string',
        filter: false,
        editable: false,
        valuePrepareFunction: (cell, row) => {
          const subCategoryNames = []

          row.categories.forEach(category => {
            category.subCategories.forEach(subCategory => {
              if (row.subcategories.includes(subCategory._id)) {
                subCategoryNames.push(subCategory.name)
              }
            })
          })

          if (subCategoryNames.length === 0) {
            return '--'
          } else {
            if (subCategoryNames.length > 2) {
              return 'Multiple'
            } else {
              return `${subCategoryNames.join(', ')}`
            }
          }
        }
      }
      // questionModes: {
      //   title: 'Question Modes',
      //   type: 'string',
      //   filter: false,
      //   editable: false,
      //   valuePrepareFunction: (cell, row) => {
      //     const selectedQuestionModes = Object.keys(row.questionModes).filter(
      //       key => row.questionModes[key] === true && key
      //     )

      //     if (selectedQuestionModes.length === 0) {
      //       return '--'
      //     } else {
      //       if (selectedQuestionModes.length > 2) {
      //         return 'Multiple'
      //       } else {
      //         return `${selectedQuestionModes.join(', ')}`
      //       }
      //     }
      //   }
      // }
    }
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'Take test':
        this.startTest(event.data._id)
        break

      default:
        break
    }
  }

  startTest(testId) {
    this.dialogService
      .open(TakeTestComponent, {
        context: {
          testId: testId
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(data => {
        this.loadDataSource()
      })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeExam(data) {}
}
