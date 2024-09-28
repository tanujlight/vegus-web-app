import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import {Observable, Subject, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {takeUntil} from 'rxjs/operators'
import {VideoQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-video',
  templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() questionId: any
  @Input() question: VideoQuestion
  @Output() save = new EventEmitter<any>()
  @ViewChild('figVideo') figVideo: ElementRef // audio tag reference
  selectedVideo
  protected readonly unsubscribe$ = new Subject<void>()
  constructor(private toasterService: NbToastrService, private questionsService: QuestionsApi) {
    this.initializeQuestion()
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.initializeQuestion()
    }
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        if (item.isCorrect) {
          this.question.correctOption = index
        }
      })
    }
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
        },
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        }
      ],
      correctOption: null,
      optionsCount: 4,
      videoUrl: ''
    }
  }

  optionCountChange() {
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }
    if (this.question.optionsCount > 15) {
      this.toasterService.danger('', `Maximum number of option will be 15`)
      return
    }

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
    if (!this.question.optionsCount) {
      this.toasterService.danger('', `Number of option is required`)
      return
    }
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }

    if (this.question.optionsCount > 15) {
      this.toasterService.danger('', `Maximum number of option will be 15`)
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.value)

    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }

    if (!this.question.correctOption && this.question.correctOption !== 0) {
      this.toasterService.danger('', `Select correct option`)
      return
    }

    if (!this.figVideo.nativeElement.src && !this.question.videoUrl) {
      this.toasterService.danger('', `Select video`)
      return
    }

    this.question.optionsArray.map((item, index) => {
      this.question.optionsArray[index].isCorrect = false
    })

    this.question.optionsArray[this.question.correctOption].isCorrect = true
    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      videoUrl: this.question.videoUrl,
      marks: 1
    }

    if (this.figVideo.nativeElement.src) {
      if (this.question.videoUrl) {
        this.removeFile(sendData)
      } else {
        this.uploadFile(sendData)
      }
    } else {
      this.save.emit(sendData)
    }
  }

  removeFile(sendData) {
    let observable = new Observable()
    observable = this.questionsService.removeFile(this.questionId, this.question.videoUrl)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe((fileData: any) => {
      this.uploadFile(sendData)
    })
  }

  uploadFile(sendData) {
    let observable = new Observable()
    observable = this.questionsService.uploadFile(this.questionId, this.selectedVideo)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe((fileData: any) => {
      sendData.videoUrl = fileData.fileUrl
      this.save.emit(sendData)
      this.toasterService.success('', 'File uploaded')
    })
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const fileSize = event.target.files[0].size / 1000000 // in MB
      if (fileSize < 10) {
        this.selectedVideo = event.target.files[0]
        const audSrc = URL.createObjectURL(event.target.files[0])
        this.figVideo.nativeElement.src = audSrc
      } else {
        this.toasterService.danger('', `Select file size should not be greater than 10 mb`)
      }
    }
  }
}
