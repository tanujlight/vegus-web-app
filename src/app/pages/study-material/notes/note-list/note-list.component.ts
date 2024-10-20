import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {ActivatedRoute, Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../../components/confirmation-dialog/confirmation-dialog.component'
import {NoteViewComponent} from '../note-view/note-view.component'
import {NotesApi} from 'app/services/apis/notes.service'
import {UserStore} from '../../../../@core/stores/user.store'
import {User} from 'app/@core/interfaces/common/users'
import {CategoriesApi} from 'app/services/apis/categories.service'

@Component({
  selector: 'ngx-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  user: User = null
  showList = false
  category
  subCategory
  notes
  openAccordianCategoryId

  constructor(
    private notesService: NotesApi,
    private router: Router,
    private dialogService: NbDialogService,
    private userStore: UserStore,
    private route: ActivatedRoute,
    private categoriesService: CategoriesApi
  ) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
    this.route.queryParams.subscribe(params => {
      if (params && params.category && params.subCategory) {
        this.loadCategoryFromParams(params.category, params.subCategory)
      } else if (params && params.category) {
        this.openAccordianCategoryId = params.category
      }
    })
  }

  loadCategoryFromParams(categoryId, subCategoryId) {
    this.categoriesService.get(categoryId).subscribe(
      category => {
        const subCategory = category.subCategories.filter(i => i.id === subCategoryId)[0]
        this.itemClicked({
          category,
          subCategory
        })
      },
      () => {}
    )
  }

  itemClicked(event) {
    this.category = event.category
    this.subCategory = event.subCategory
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.category.id,
        subCategory: this.subCategory.id
      }
    })
    this.showList = true
    this.loadNote()
  }

  loadNote() {
    const sendData = `?category=${this.category.id}&subCategory=${this.subCategory.id}`
    this.notesService.list(sendData).subscribe(
      notes => {
        this.notes = notes
      },
      () => {}
    )
  }

  onSelectBreadcrumb(params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    })
    this.showList = false
    this.notes = []
    this.category = null
    this.subCategory = null
  }

  private onDeleteConfirm(event): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to delete?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.removeItem(event.data)
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'add':
        this.routeTo(`pages/study-material/notes/new`)
        break

      case 'edit':
        this.routeTo(`pages/study-material/notes/edit/${event.data.id}`)
        break

      case 'view':
        this.openViewDialog(event.data)
        break

      default:
        break
    }
  }

  openViewDialog(item) {
    this.dialogService.open(NoteViewComponent, {
      context: {
        uniqueIdentifier: item.uniqueIdentifier,
        title: item.title,
        fileUrl: item.fileUrl
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeItem(data) {
    this.notesService.delete(data.id).subscribe(res => {
      this.loadNote()
    })
  }
}
