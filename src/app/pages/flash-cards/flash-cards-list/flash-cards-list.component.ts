import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {FlashCardsApi} from 'app/services/apis/flash-cards.service'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {DatePipe} from '@angular/common'
import {UserStore} from '../../../@core/stores/user.store'

import {Category, SubCategory} from '../../categories/categories.interface'
import {FlashCardComponent, FlashCardFormMode} from '../flash-card/flash-card.component'
import {FlashCard} from '../flash-cards.interface'
import {User} from 'app/@core/interfaces/common/users'

@Component({
  selector: 'ngx-flash-cards-list',
  templateUrl: './flash-cards-list.component.html',
  styleUrls: ['./flash-cards-list.component.scss']
})
export class FlashCardsListComponent implements OnInit {
  user: User = null

  isTableView = false

  tableColumns: any = {}
  flashCards = []

  categories = []
  selectedCategory = null
  selectedSubCategory = null
  breadcrumbs = ['Categories']

  flashCardSize: 'small' | 'medium' = 'small'

  tableSettings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      type: 'html',
      custom: [
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete"></i>'
        }
      ]
    }
  }

  constructor(
    private flashCardsApi: FlashCardsApi,
    private router: Router,
    private dialogService: NbDialogService,
    private categoriesService: CategoriesApi,
    private userStore: UserStore,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
    this.getCategoires()
    this.initializeTableColumns()
    this.calculateFlashCardSize()
  }

  private calculateFlashCardSize() {
    this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large]).subscribe(result => {
      if (result.breakpoints[Breakpoints.Medium]) {
        this.flashCardSize = 'small'
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.flashCardSize = 'medium'
      } else {
        this.flashCardSize = 'small'
      }
    })
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  private initializeTableColumns() {
    this.tableColumns = {
      uniqueIdentifier: {
        title: 'ID',
        type: 'string',
        editable: false
      },
      title: {
        title: 'Title',
        type: 'string',
        editable: false,
        valuePrepareFunction: (cell, row) => {
          const maxLength = 100 // Set the maximum character limit for the title
          if (cell.length > maxLength) {
            return cell.substr(0, maxLength) + ' ... ' // Truncate the title and append ellipsis
          }
          return cell
        }
      },
      createdAt: {
        title: 'Added At',
        type: 'string',
        valuePrepareFunction: (createdAt: any) => {
          return new DatePipe('en-US').transform(createdAt, 'yyyy/MM/dd')
        }
      }
    }
  }

  switchView() {
    this.isTableView = !this.isTableView
  }

  onDeleteConfirm(flashCard): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to delete?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.removeFlashCard(flashCard)
        }
      })
  }

  openAddFlashCardDialog() {
    this.dialogService
      .open(FlashCardComponent, {
        context: {
          mode: FlashCardFormMode.ADD,
          category: this.selectedCategory,
          subCategory: this.selectedSubCategory
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe((flashCard: FlashCard) => {
        if (flashCard) {
          this.flashCards.push(flashCard)
          this.flashCards = [...this.flashCards]
        }
      })
  }

  openEditFlashCardDialog(id: string) {
    this.dialogService
      .open(FlashCardComponent, {
        context: {
          flashCardId: id,
          mode: FlashCardFormMode.EDIT
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe((flashCard: FlashCard) => {
        if (flashCard) {
          const indexToUpdate = this.flashCards.findIndex(c => c.id === flashCard.id)

          if (indexToUpdate !== -1) {
            this.flashCards[indexToUpdate] = flashCard

            this.flashCards = [...this.flashCards]
          }
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event.data)
        break

      case 'edit':
        this.openEditFlashCardDialog(event.data.id)
        break

      default:
        break
    }
  }

  onSelectBreadcrumb(item: string) {
    switch (item) {
      case 'Categories':
        this.selectedCategory = null
        this.selectedSubCategory = null
        this.breadcrumbs = ['Categories']
        break

      case 'Sub Categories':
        this.selectedSubCategory = null
        this.breadcrumbs.pop()
        this.breadcrumbs.pop()
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  onSelectCategory(category: Category) {
    if (category.subCategories && category.subCategories.length > 0) {
      this.selectedCategory = category
      this.breadcrumbs.push(category.name)
      this.breadcrumbs.push('Sub Categories')
    }
  }

  onSelectSubCategory(subCategory: SubCategory) {
    this.selectedSubCategory = subCategory
    this.breadcrumbs.push(subCategory.name)
    this.breadcrumbs.push('Flash Cards')
    this.getFlashCards()
  }

  // External Api's call
  private removeFlashCard(data) {
    this.flashCardsApi.delete(data.id).subscribe(res => {
      this.flashCards = this.flashCards.filter(c => c.id !== data.id)
    })
  }

  getFlashCards() {
    const query = {
      category: this.selectedCategory.id,
      subCategory: this.selectedSubCategory.id
    }
    this.flashCardsApi.list(query).subscribe((flashCards: any[]) => {
      this.flashCards = flashCards
    })
  }
}
