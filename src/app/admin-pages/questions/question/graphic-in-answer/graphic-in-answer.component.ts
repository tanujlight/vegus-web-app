import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {forkJoin, Observable, Subject, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {GraphicInAnswer} from '../../questions.interface'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {takeUntil} from 'rxjs/operators'

@Component({
  selector: 'ngx-graphic-in-answer',
  templateUrl: './graphic-in-answer.component.html',
  styleUrls: ['./graphic-in-answer.component.scss']
})
export class GraphicInAnswerComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: GraphicInAnswer
  @Input() questionId: string
  @Output() save = new EventEmitter<any>()

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
          previewUrl: null,
          selectedImage: null,
          imageUrl: '',
          isCorrect: false
        },
        {
          previewUrl: null,
          selectedImage: null,
          imageUrl: '',
          isCorrect: false
        }
      ],
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
          previewUrl: null,
          selectedImage: null,
          imageUrl: '',
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

  async onSubmit() {
    if (!this.validateOptionsCount()) return

    const hasMissingImageUrl = this.question.optionsArray.some(item => !item.imageUrl && !item.selectedImage)

    if (hasMissingImageUrl) {
      this.showError('Options are required')
      return
    }

    if (!this.question.correctOption && this.question.correctOption !== 0) {
      this.showError(`Select correct option`)
      return
    }

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

    await this.prepareQuestionOptions(this.question.optionsArray)

    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      marks: 1
    }

    this.save.emit(sendData)
  }

  async prepareQuestionOptions(optionsArray): Promise<void> {
    const promises = []
    optionsArray.map((item, index) => {
      promises.push(this.handleSingleOptionUpload(item, index))
    })

    await Promise.all(promises)
  }

  async handleSingleOptionUpload(option, index): Promise<void> {
    if (option.selectedImage) {
      // upload new file
      const newFileUrl = await this.uploadFile(option.selectedImage)
      if (option.imageUrl) {
        // remove old file
        await this.removeFile(option.imageUrl)
      }

      // reassign the question option for the particular index
      this.question.optionsArray[index] = {
        imageUrl: newFileUrl,
        isCorrect: option.isCorrect
      }
    } else {
      // reassign the question option for the particular index
      this.question.optionsArray[index] = {
        imageUrl: option.imageUrl,
        isCorrect: option.isCorrect
      }
    }
  }

  async uploadFile(file): Promise<string> {
    return new Promise((resolve, reject) => {
      let observable = new Observable()
      observable = this.questionsService.uploadFile(this.questionId, file)
      observable.pipe(takeUntil(this.unsubscribe$)).subscribe((fileData: any) => {
        resolve(fileData.fileUrl)
      })
    })
  }

  async removeFile(fileUrl): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let observable = new Observable()
      observable = this.questionsService.removeFile(this.questionId, fileUrl)
      observable.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        resolve(true)
      })
    })
  }

  onFileSelected(event, index) {
    if (event.target.files && event.target.files[0]) {
      const fileSize = event.target.files[0].size / 1000000 // in MB
      if (fileSize < 2) {
        this.question.optionsArray[index].selectedImage = event.target.files[0]
        this.previewFile(event, index)
      } else {
        this.showError(`File size should be less than 2MB`)
      }
    }
  }

  private previewFile(event: Event, index): void {
    const file = (event.target as HTMLInputElement).files[0]
    const reader = new FileReader()

    reader.onload = () => {
      this.question.optionsArray[index].previewUrl = reader.result
    }

    if (file) {
      reader.readAsDataURL(file)
    } else {
      this.question.optionsArray[index].previewUrl = null
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
