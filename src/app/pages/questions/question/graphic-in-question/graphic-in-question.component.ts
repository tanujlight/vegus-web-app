import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subject, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {GraphicInQuestion} from '../../questions.interface'
import {takeUntil} from 'rxjs/operators'
import {QuestionsApi} from 'app/services/apis/questions.service'

@Component({
  selector: 'ngx-graphic-in-question',
  templateUrl: './graphic-in-question.component.html',
  styleUrls: ['./graphic-in-question.component.scss']
})
export class GraphicInQuestionComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() questionId: string
  @Input() question: GraphicInQuestion
  @Output() save = new EventEmitter<any>()
  selectedImage

  previewUrl: string | ArrayBuffer | null = null

  protected readonly unsubscribe$ = new Subject<void>()

  constructor(private toasterService: NbToastrService, private questionsService: QuestionsApi) {
    this.initializeQuestion()
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  initializeQuestion() {
    this.question = {
      optionsArray: [
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        }
      ],
      imageUrl: null,
      correctOption: null,
      optionsCount: 2
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.initializeQuestion()
    }

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        if (item.isCorrect) {
          this.question.correctOption = index
        }
      })
    }
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  optionCountChange() {
    if (!this.validateOptionsCount()) return

    const changeNeeded = this.question.optionsCount - this.question.optionsArray.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.optionsArray.push({
          value: '',
          isCorrect: false
        })
      }
    } else {
      for (let i = 0; i < changeNeeded * -1; i++) {
        this.question.optionsArray.pop()
      }
      if (this.question.correctOption + 1 > this.question.optionsArray.length) {
        this.question.correctOption = null
      }
    }
  }

  onSubmit() {
    if (!this.validateOptionsCount()) return

    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }
    if (!this.question.correctOption && this.question.correctOption !== 0) {
      this.toasterService.danger('', `Select correct option`)
      return
    }
    // if (!this.selectedImage && !this.question.imageUrl) {
    //   this.toasterService.danger('', `Please upload an image in question`)
    //   return
    // }

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    this.question.optionsArray.forEach(option => {
      option.isCorrect = false
    })

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    this.question.optionsArray[this.question.correctOption].isCorrect = true

    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      imageUrl: this.question.imageUrl,
      marks: 1
    }

    if (this.selectedImage) {
      if (this.question.imageUrl) {
        this.removeFile(sendData)
      } else {
        this.uploadFile(sendData)
      }
    } else {
      this.save.emit(sendData)
    }
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const fileSize = event.target.files[0].size / 1000000 // in MB
      if (fileSize < 2) {
        this.selectedImage = event.target.files[0]
        this.previewFile(event)
      } else {
        this.showError('File size should be less than 2MB')
      }
    }
  }

  private uploadFile(sendData) {
    let observable = new Observable()
    observable = this.questionsService.uploadFile(this.questionId, this.selectedImage)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe((fileData: any) => {
      sendData.imageUrl = fileData.fileUrl
      this.save.emit(sendData)
      this.toasterService.success('', 'File uploaded')
    })
  }

  private removeFile(sendData) {
    let observable = new Observable()
    observable = this.questionsService.removeFile(this.questionId, this.question.imageUrl)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe((fileData: any) => {
      this.uploadFile(sendData)
    })
  }

  private previewFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0]
    const reader = new FileReader()

    reader.onload = () => {
      this.previewUrl = reader.result
    }

    if (file) {
      reader.readAsDataURL(file)
    } else {
      this.previewUrl = null
    }
  }

  private validateOptionsCount(): boolean {
    if (!this.question.optionsCount || this.question.optionsCount < 2) {
      this.showError('Minimum number of options will be 2')
      return false
    }

    if (this.question.optionsCount > 50) {
      this.showError('Maximum number of options will be 50')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
