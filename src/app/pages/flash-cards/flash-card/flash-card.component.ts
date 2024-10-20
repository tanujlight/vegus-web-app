import {Component, Input, AfterViewInit, OnDestroy} from '@angular/core'
import {Category, SubCategory} from 'app/pages/categories/categories.interface'
import {FlashCard} from '../flash-cards.interface'
import {FlashCardsApi} from 'app/services/apis/flash-cards.service'
import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import ObjectId from 'bson-objectid'
import {NbDialogRef, NbToastrService} from '@nebular/theme'
import {TextEditorUploadAdapter} from 'app/components/text-editor/text-editor-upload-adapter.service'

export enum FlashCardFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-flash-card',
  templateUrl: './flash-card.component.html',
  styleUrls: ['./flash-card.component.scss'],
  providers: [TextEditorUploadAdapter]
})
export class FlashCardComponent implements AfterViewInit, OnDestroy {
  @Input() mode: FlashCardFormMode
  @Input() category: Category
  @Input() subCategory: SubCategory
  @Input() flashCardId: string

  flashCard: FlashCard

  protected readonly unsubscribe$ = new Subject<void>()

  constructor(
    private flashCardsApi: FlashCardsApi,
    protected dialogRef: NbDialogRef<FlashCardComponent>,
    private toasterService: NbToastrService
  ) {
    this.flashCard = {
      title: '',
      description: '',
      uniqueIdentifier: '',
      importantDescription: '',
      category: '',
      subCategory: ''
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.flashCardId && this.mode === FlashCardFormMode.EDIT) {
        this.getFlashCard()
      } else {
        this.flashCard._id = new ObjectId().toHexString()
        this.flashCard.id = new ObjectId().toHexString()
        this.flashCard.category = this.category._id || this.category.id
        this.flashCard.subCategory = this.subCategory._id || this.subCategory.id
      }
    })
  }

  private getFlashCard() {
    this.flashCardsApi.get(this.flashCardId).subscribe(flashCard => {
      this.flashCard = flashCard
    })
  }

  back() {
    this.dialogRef.close()
  }

  submit() {
    if (!this.flashCard.title) {
      this.toasterService.danger('', `Title is required!`)
      return
    }

    if (!this.flashCard.description) {
      this.toasterService.danger('', `Description is required!`)
      return
    }

    let observable = new Observable()

    if (this.mode === FlashCardFormMode.EDIT) {
      observable = this.flashCardsApi.update(this.flashCard)
    } else {
      observable = this.flashCardsApi.add(this.flashCard)
    }

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (res: any) => {
        this.handleSuccessResponse(res)
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse(flashCard: FlashCard) {
    let message = ''
    switch (this.mode) {
      case FlashCardFormMode.ADD:
        message = 'Flash card created!'
        break
      case FlashCardFormMode.EDIT:
        message = 'Flash card updated!'
        break
      default:
        message = 'Flash card updated!'
    }
    this.toasterService.success('', message)
    this.dialogRef.close(flashCard)
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
