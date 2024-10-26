import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {ActivatedRoute, Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../../components/confirmation-dialog/confirmation-dialog.component'
import {VideoViewComponent} from '../video-view/video-view.component'
import {VideosApi} from 'app/services/apis/videos.service'
import {UserStore} from '../../../../@core/stores/user.store'
import {User} from 'app/@core/interfaces/common/users'
import {CategoriesApi} from 'app/services/apis/categories.service'

@Component({
  selector: 'ngx-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  user: User = null
  showList = false
  category
  subCategory
  videos
  openAccordianCategoryId

  constructor(
    private VideoService: VideosApi,
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
    this.loadVideo()
  }

  loadVideo() {
    const sendData = `?category=${this.category.id}&subCategory=${this.subCategory.id}`
    this.VideoService.list(sendData).subscribe(
      videos => {
        this.videos = videos
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
    this.videos = []
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
        this.routeTo(`admin/study-material/videos/new`)
        break

      case 'edit':
        this.routeTo(`admin/study-material/videos/edit/${event.data.id}`)
        break

      case 'view':
        this.openViewDialog(event.data)
        break

      default:
        break
    }
  }

  openViewDialog(item) {
    this.dialogService.open(VideoViewComponent, {
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

  removeItem(data) {
    this.VideoService.delete(data.id).subscribe(res => {
      this.loadVideo()
    })
  }
}
