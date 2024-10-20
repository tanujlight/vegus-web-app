import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Router} from '@angular/router'

import {Observable, Subject} from 'rxjs'

import {NbToastrService} from '@nebular/theme'

import {QuestionAndCaseStudy} from '../../../exams/exams.interface'
import {Video} from '../videos.interface'
import {CategoriesApi} from '../../../../services/apis/categories.service'
import {Category} from '../../../categories/categories.interface'
import {VideosApi} from 'app/services/apis/videos.service'
import {takeUntil} from 'rxjs/operators'
import ObjectId from 'bson-objectid'
import {LoaderService} from 'app/services/loader.service'
import {Location} from '@angular/common'
export enum VideoFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  @ViewChild('figVideo') figVideo: ElementRef // file tag reference
  selectedThumbnail
  selectedfile
  // instructions;
  categories = []
  subCategories = []
  videoForm: FormGroup
  videoId: string
  tempVideoId: string
  fileUrl: string
  thumbnailUrl: string

  questionsAndCaseStudies: QuestionAndCaseStudy[] = []

  protected readonly unsubscribe$ = new Subject<void>()

  mode: VideoFormMode
  setViewMode(viewMode: VideoFormMode) {
    this.mode = viewMode
  }

  get title() {
    return this.videoForm.get('title')
  }

  get timeLimit() {
    return this.videoForm.get('timeLimit')
  }

  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi,
    private videosService: VideosApi,
    private fb: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id')
    this.getCategoires()
    this.initForm()
    this.loadVideoData()
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  categoryChange() {
    if (this.videoForm.value.category) {
      this.subCategories = []
      const selectedCategory = this.categories.find(category => category.id === this.videoForm.value.category)
      if (selectedCategory) {
        this.subCategories = selectedCategory.subCategories
      }
    }
  }

  initForm() {
    this.videoForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      title: this.fb.control('', [Validators.required]),
      category: this.fb.control('', [Validators.required]),
      subCategory: this.fb.control('', [Validators.required])
    })
  }

  loadVideoData() {
    if (this.videoId) {
      this.setViewMode(VideoFormMode.EDIT)
      this.loadVideo(this.videoId)
    } else {
      this.setViewMode(VideoFormMode.ADD)
    }
  }

  loadVideo(id?) {
    this.videosService.get(id).subscribe(note => {
      this.videoForm.setValue({
        id: note.id || '',
        uniqueIdentifier: note.uniqueIdentifier || '',
        title: note.title,
        category: note.category || null,
        subCategory: note.subCategory || null
      })
      this.figVideo.nativeElement.src = note.fileUrl
      // this.instructions = note.instructions
      setTimeout(() => {
        this.categoryChange()
      }, 500)
    })
  }

  convertToVideo(value: any): Video {
    const video: Video = value
    return video
  }

  submit() {
    const video: Video = this.convertToVideo(this.videoForm.value)
    if (!video.id) {
      this.tempVideoId = new ObjectId().toHexString()
    }
    if (!this.selectedfile && !this.videoId) {
      this.toasterService.danger('', `Select File`)
      return
    }
    if (!this.selectedThumbnail && !this.videoId) {
      this.toasterService.danger('', `Select Thumbnail`)
      return
    }
    const videoId = video.id ? video.id : this.tempVideoId
    const promises = []
    if (this.selectedfile) {
      promises.push(this.uploadFile(this.selectedfile, 'file', videoId))
    }
    if (this.selectedThumbnail) {
      promises.push(this.uploadFile(this.selectedThumbnail, 'thumbnail', videoId))
    }
    Promise.all(promises)
      .then(() => this.save())
      .catch(() => {})
  }

  save() {
    const video: Video = this.convertToVideo(this.videoForm.value)
    if (this.fileUrl) {
      video.fileUrl = this.fileUrl
    }
    if (!video.id) {
      video._id = this.tempVideoId
    }
    if (this.thumbnailUrl) {
      video.thumbnailUrl = this.thumbnailUrl
    }
    // video['instructions'] = this.instructions
    let observable = new Observable<Video>()
    observable = video.id ? this.videosService.update(video) : this.videosService.add(video)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.loaderService.isLoadingOverload.next({isLoading: false, message: ''})
        this.handleSuccessResponse()
      },
      err => {
        this.loaderService.isLoadingOverload.next({isLoading: false, message: ''})
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse() {
    switch (this.mode) {
      case VideoFormMode.ADD:
        this.toasterService.success('', 'Video created!')
        break
      case VideoFormMode.EDIT:
        this.toasterService.success('', 'Video updated!')
        break
      default:
        this.toasterService.success('', 'Video updated!')
        break
    }
    this.routeTo(`pages/study-material/videos/list`)
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back() {
    this.location.back()
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  onFileSelected(event, type) {
    if (event.target.files && event.target.files[0]) {
      const fileSize = event.target.files[0].size / 1000000 // in MB
      if (type === 'thumbnail') {
        // Allow file size less than 200mb
        if (fileSize < 2) {
          this.selectedThumbnail = event.target.files[0]
        } else {
          this.toasterService.danger('Thumbnail size should be less than 2mb', 'File size exceeded!')
        }
      } else {
        // allowed only file size less than 900 MB
        // if (fileSize < 900) {
        this.selectedfile = event.target.files[0]
        const audSrc = URL.createObjectURL(event.target.files[0])
        this.figVideo.nativeElement.src = audSrc
        // } else {
        //   this.toasterService.danger('File size should be less than 900 MB', 'File size exceeded!')
        // }
      }
    }
  }

  uploadFile(file: File, type: string, noteId: string): Promise<void> {
    const sendData = {
      contentType: file.type,
      type: type
    }
    this.loaderService.isLoadingOverload.next({isLoading: true, message: 'Uploading file...'})
    return new Promise((resolve, reject) => {
      this.videosService.getPreSignedUrl(noteId, sendData).subscribe((res: any) => {
        if (res && res.signedUrl && res.fileUrl) {
          fetch(res.signedUrl, {
            method: 'PUT',
            body: file
          })
            .then(() => {
              if (type === 'file') {
                this.fileUrl = res.fileUrl
              } else {
                this.thumbnailUrl = res.fileUrl
              }
              resolve()
            })
            .catch(err => {
              this.toasterService.danger(err.message || 'Something went wrong!', 'File upload failed!')
              reject()
            })
        } else {
          this.toasterService.danger('', 'Something went wrong, Please try again!')
          reject()
        }
      })
    })
  }
}
