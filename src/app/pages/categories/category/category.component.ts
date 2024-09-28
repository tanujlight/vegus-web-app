import {Component, OnInit, OnDestroy} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'

import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import {NbToastrService} from '@nebular/theme'

import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category, SubCategory} from '../categories.interface'

export enum CategoryFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup

  categoryId: string

  subCategories: SubCategory[] = []

  protected readonly unsubscribe$ = new Subject<void>()

  get name() {
    return this.categoryForm.get('name')
  }

  get isActive() {
    return this.categoryForm.get('isActive')
  }

  get description() {
    return this.categoryForm.get('description')
  }

  mode: CategoryFormMode
  setViewMode(viewMode: CategoryFormMode) {
    this.mode = viewMode
  }

  constructor(
    private categoriesService: CategoriesApi,
    private _location: Location,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')

    this.initCategoryForm()
    this.loadCategoryData()
  }

  initCategoryForm() {
    this.categoryForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control('', []),
      isActive: this.fb.control(true)
    })
  }

  loadCategoryData() {
    if (this.categoryId) {
      this.setViewMode(CategoryFormMode.EDIT)
      this.loadCategory(this.categoryId)
    } else {
      this.setViewMode(CategoryFormMode.ADD)
    }
  }

  loadCategory(id?) {
    this.categoriesService.get(id).subscribe(category => {
      this.categoryForm.setValue({
        id: category.id || '',
        uniqueIdentifier: category.uniqueIdentifier || '',
        name: category.name,
        isActive: category.isActive,
        description: category.description || ''
      })

      this.subCategories = category.subCategories
    })
  }

  convertToCategory(value: any): Category {
    const category: Category = value
    return category
  }

  save() {
    const category: Category = this.convertToCategory(this.categoryForm.value)

    let observable = new Observable<Category>()
    observable = category.id ? this.categoriesService.update(category) : this.categoriesService.add(category)

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.categoryId = res.id
        this.handleSuccessResponse()
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse() {
    let message = ''
    switch (this.mode) {
      case CategoryFormMode.ADD:
        message = 'Category created!'
        break
      case CategoryFormMode.EDIT:
        message = 'Category updated!'
        break
      default:
        message = 'Category updated!'
    }
    this.toasterService.success('', message)
    // this.back()
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back() {
    this._location.back()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
