import {Component, OnInit, OnDestroy, Input, Optional} from '@angular/core'
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'

import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'
import {Router} from '@angular/router'

import ObjectId from 'bson-objectid'

import * as Editor from '../../../../assets/ckeditor/build/ckeditor.js'

import {NbDialogRef, NbToastrService} from '@nebular/theme'

import {CaseStudiesApi} from '../../../services/apis/case-studies.service.js'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {UploadAdapter} from '../upload-adapter.service.js'
import {Category} from '../../categories/categories.interface.js'

export enum CaseStudyFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
  providers: [CaseStudiesApi, UploadAdapter]
})
export class CaseStudyComponent implements OnInit, OnDestroy {
  @Input() isDialog?: boolean = false
  @Input() caseStudyItemId?: string
  caseStudyForm: FormGroup

  caseStudyId: string

  caseStudy
  examUsage = {
    practice: false,
    exam: false,
    assessment: false
  }

  protected readonly unsubscribe$ = new Subject<void>()

  get title() {
    return this.caseStudyForm.get('title')
  }

  get tabsFormArray(): FormArray {
    return this.caseStudyForm.get('tabs') as FormArray
  }

  mode: CaseStudyFormMode
  setViewMode(viewMode: CaseStudyFormMode) {
    this.mode = viewMode
  }
  categories = []
  subCategories = []

  public editor = Editor

  constructor(
    private caseStudiessService: CaseStudiesApi,
    private _location: Location,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi,
    private fb: FormBuilder,
    private uploadAdapter: UploadAdapter,
    @Optional() protected componentRef: NbDialogRef<CaseStudyComponent>,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCaseStudyData()
    this.getCategoires()
    this.initCaseStudyForm()
  }

  onEditorReady(event: any) {
    event.plugins.get('FileRepository').createUploadAdapter = loader => {
      this.uploadAdapter.setLoader(loader)

      return this.uploadAdapter
    }
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  categoryChange() {
    this.subCategories = []
    const selectedCategory = this.categories.find(category => category.id === this.caseStudyForm.value.category)
    if (selectedCategory) {
      this.subCategories = selectedCategory.subCategories
    }
  }

  addTab() {
    const tabFormGroup = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
      _id: this.fb.control(new ObjectId().toHexString())
    })

    this.tabsFormArray.push(tabFormGroup)
  }

  duplicateTab(copyIndex: number) {
    const copiedItem = this.tabsFormArray.value[copyIndex]
    const pasteIndex = copyIndex + 1

    const tabFormGroup = this.fb.group({
      title: this.fb.control(copiedItem.title, [Validators.required]),
      description: this.fb.control(copiedItem.description, [Validators.required]),
      _id: this.fb.control(new ObjectId().toHexString())
    })

    this.tabsFormArray.insert(pasteIndex, tabFormGroup)
  }

  removeTab(index: number) {
    this.tabsFormArray.removeAt(index)
  }

  initCaseStudyForm() {
    this.caseStudyForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      category: this.fb.control('', [Validators.required]),
      subCategory: this.fb.control('', [Validators.required]),
      tabs: this.fb.array([]),
      title: this.fb.control('', [Validators.required])
    })
  }

  loadCaseStudyData() {
    /**
     * If id is exist, it means that we are in edit mode
     */
    const caseStudyId = this.route.snapshot.paramMap.get('id')

    if ((caseStudyId && caseStudyId !== 'new') || this.caseStudyItemId) {
      this.caseStudyId = this.caseStudyItemId ? this.caseStudyItemId : caseStudyId
      this.setViewMode(CaseStudyFormMode.EDIT)
      this.loadCaseStudy(this.caseStudyId)
    } else {
      this.caseStudyId = new ObjectId().toHexString()
      this.setViewMode(CaseStudyFormMode.ADD)
    }

    this.uploadAdapter.setId(this.caseStudyId)
  }

  loadCaseStudy(id?) {
    this.caseStudiessService.get(id).subscribe(caseStudy => {
      this.caseStudyForm.controls.id.setValue(caseStudy.id)
      this.caseStudyForm.controls.uniqueIdentifier.setValue(caseStudy.uniqueIdentifier)
      this.caseStudyForm.controls.title.setValue(caseStudy.title)
      this.caseStudyForm.controls.category.setValue(caseStudy.category.id)
      this.caseStudyForm.controls.subCategory.setValue(caseStudy.subCategory)
      this.subCategories = caseStudy.category.subCategories
      if (caseStudy.examUsage) {
        this.examUsage = caseStudy.examUsage
      }
      this.setExistingTabs(caseStudy.tabs)

      this.caseStudy = caseStudy
    })
  }

  private setExistingTabs(existingTabs = []) {
    const tabsFormArray = this.caseStudyForm.get('tabs') as FormArray

    existingTabs.forEach(tab => {
      const tabFormGroup = this.fb.group({
        title: [tab.title],
        description: [tab.description],
        _id: [tab._id]
      })

      tabsFormArray.push(tabFormGroup)
    })
  }

  convertToCaseStudy(value: any) {
    const caseStudy = value
    return caseStudy
  }

  save() {
    const caseStudy = this.convertToCaseStudy(this.caseStudyForm.value)
    let observable = new Observable()

    if (this.mode === CaseStudyFormMode.EDIT) {
      observable = this.caseStudiessService.update(caseStudy)
    } else {
      caseStudy._id = this.caseStudyId
      observable = this.caseStudiessService.add(caseStudy)
    }
    caseStudy.examUsage = this.examUsage

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      data => {
        this.handleSuccessResponse(data)
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse(data) {
    switch (this.mode) {
      case CaseStudyFormMode.ADD:
        this.toasterService.success('', 'Case study created!')
        this.routeTo(`admin/case-studies/edit/${this.caseStudyId}`)
        break
      case CaseStudyFormMode.EDIT:
        this.toasterService.success('', 'Case study updated!')
        break
      default:
        this.toasterService.success('', 'Case study updated!')
        break
    }
    this.back(data)
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back(data?) {
    if (this.isDialog) {
      this.componentRef.close(data)
      return
    } else {
      this._location.back()
    }
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
