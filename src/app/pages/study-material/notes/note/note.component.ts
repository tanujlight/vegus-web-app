import {Component, OnInit, OnDestroy} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Router} from '@angular/router'

import {Observable, Subject} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

import {QuestionAndCaseStudy} from '../../../exams/exams.interface'
import {Note} from '../notes.interface'
import {CategoriesApi} from '../../../../services/apis/categories.service'
import {Category} from '../../../categories/categories.interface'
import {NotesApi} from 'app/services/apis/notes.service'
import {takeUntil} from 'rxjs/operators'
import ObjectId from 'bson-objectid'
import {LoaderService} from 'app/services/loader.service'
import {Location} from '@angular/common'
export enum NoteFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {
  selectedfile
  selectedThumbnail
  // instructions;
  categories = []
  subCategories = []
  noteForm: FormGroup
  noteId: string
  tempNoteId: string
  fileUrl: string
  thumbnailUrl: string

  questionsAndCaseStudies: QuestionAndCaseStudy[] = []

  protected readonly unsubscribe$ = new Subject<void>()

  mode: NoteFormMode
  setViewMode(viewMode: NoteFormMode) {
    this.mode = viewMode
  }

  get title() {
    return this.noteForm.get('title')
  }

  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi,
    private notesService: NotesApi,
    private fb: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noteId = this.route.snapshot.paramMap.get('id')
    this.getCategoires()

    this.initForm()
    this.loadNoteData()
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  categoryChange() {
    if (this.noteForm.value.category) {
      this.subCategories = []
      const selectedCategory = this.categories.find(category => category.id === this.noteForm.value.category)
      if (selectedCategory) {
        this.subCategories = selectedCategory.subCategories
      }
    }
  }

  initForm() {
    this.noteForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      title: this.fb.control('', [Validators.required]),
      category: this.fb.control('', [Validators.required]),
      subCategory: this.fb.control('', [Validators.required])
    })
  }

  loadNoteData() {
    if (this.noteId) {
      this.setViewMode(NoteFormMode.EDIT)
      this.loadNote(this.noteId)
    } else {
      this.setViewMode(NoteFormMode.ADD)
    }
  }

  loadNote(id?) {
    this.notesService.get(id).subscribe(note => {
      this.noteForm.setValue({
        id: note.id || '',
        uniqueIdentifier: note.uniqueIdentifier || '',
        title: note.title,
        category: note.category || null,
        subCategory: note.subCategory || null
      })
      // this.instructions = note.instructions
      setTimeout(() => {
        this.categoryChange()
      }, 500)
    })
  }

  convertToNote(value: any): Note {
    const note: Note = value
    return note
  }

  submit() {
    const note: Note = this.convertToNote(this.noteForm.value)
    if (!note.id) {
      this.tempNoteId = new ObjectId().toHexString()
    }
    if (!this.selectedfile && !this.noteId) {
      this.toasterService.danger('', `Select File`)
      return
    }
    if (!this.selectedThumbnail && !this.noteId) {
      this.toasterService.danger('', `Select Thumbnail`)
      return
    }
    const noteId = note.id ? note.id : this.tempNoteId
    const promises = []
    if (this.selectedfile) {
      promises.push(this.uploadFile(this.selectedfile, 'file', noteId))
    }
    if (this.selectedThumbnail) {
      promises.push(this.uploadFile(this.selectedThumbnail, 'thumbnail', noteId))
    }
    Promise.all(promises)
      .then(() => this.save())
      .catch(() => {})
  }

  save() {
    const note: Note = this.convertToNote(this.noteForm.value)
    if (this.fileUrl) {
      note.fileUrl = this.fileUrl
    }
    if (this.thumbnailUrl) {
      note.thumbnailUrl = this.thumbnailUrl
    }
    if (!note.id) {
      note._id = this.tempNoteId
    }
    // note['instructions'] = this.instructions
    let observable = new Observable<Note>()
    observable = note.id ? this.notesService.update(note) : this.notesService.add(note)
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
      case NoteFormMode.ADD:
        this.toasterService.success('', 'Note created!')
        break
      case NoteFormMode.EDIT:
        this.toasterService.success('', 'Note updated!')
        break
      default:
        this.toasterService.success('', 'Note updated!')
        break
    }
    this.routeTo(`pages/study-material/notes/list`)
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
        // Allow file size less than 200mb
        if (fileSize < 200) {
          this.selectedfile = event.target.files[0]
        } else {
          this.toasterService.danger('File size should be less than 200mb', 'File size exceeded!')
        }
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
      this.notesService.getPreSignedUrl(noteId, sendData).subscribe((res: any) => {
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
