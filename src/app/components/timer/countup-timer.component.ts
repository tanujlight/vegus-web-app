import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core'
import {interval, Subscription} from 'rxjs'

@Component({
  selector: 'ngx-countup-timer',
  template: `<span *ngIf="showTimer">{{ formattedTime }}</span>`,
  styles: []
})
export class CountUpTimerComponent implements OnInit, OnDestroy, OnChanges {
  private timerSubscription: Subscription
  private _currentValue: number = 0
  public formattedTime: string = '00:00:00'

  @Input() showTimer: boolean = true
  @Input()
  get currentValue(): number {
    return this._currentValue
  }
  set currentValue(value: number) {
    this._currentValue = value
    this.formattedTime = this.formatTime(this._currentValue)
    this.currentValueChange.emit(this._currentValue)
  }

  @Output() currentValueChange: EventEmitter<number> = new EventEmitter<number>()

  ngOnInit(): void {
    this.startTimer()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentValue'] && !changes['currentValue'].isFirstChange()) {
      this.resetTimer(changes['currentValue'].currentValue)
    }
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.currentValue++
    })
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  private resetTimer(startValue: number): void {
    this.stopTimer()
    this.currentValue = startValue
    this.startTimer()
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':')
  }
}
