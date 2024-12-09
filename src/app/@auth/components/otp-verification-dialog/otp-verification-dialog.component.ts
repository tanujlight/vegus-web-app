import {Component, Inject, Injectable, Input, OnInit} from '@angular/core'
import {NbDialogRef, NB_DIALOG_CONFIG} from '@nebular/theme'
import {UserData} from '../../../@core/interfaces/common/users'
import {MyToastService} from 'app/services/my-toast.service'
import {interval} from 'rxjs' // Import interval for timer

@Component({
  template: `
    <nb-card class="otp-verification-dialog">
      <nb-card-header><h5>Email Verification</h5></nb-card-header>
      <nb-card-body>
        <p>To complete your registration, please verify your email by entering the 6-digit OTP sent to your inbox.</p>
        <input nbInput fullWidth placeholder="Enter OTP" [(ngModel)]="otp" maxlength="6" type="text" />
        <div *ngIf="timerStarted" class="timer-text">
          <p>{{ countdown }} seconds remaining to resend OTP.</p>
        </div>
      </nb-card-body>
      <nb-card-footer>
        <div class="footer-buttons">
          <button
            nbButton
            status="basic"
            [size]="'small'"
            (click)="resendOtp()"
            [disabled]="loading || timerStarted"
            *ngIf="!timerStarted && !resent"
          >
            Resend OTP
          </button>

          <button [size]="'small'" nbButton status="primary" (click)="verifyOtp()" [disabled]="loading">
            Verify OTP
          </button>
          <button [size]="'small'" nbButton status="danger" outline (click)="cancel()" [disabled]="loading">
            Cancel
          </button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [
    `
      .otp-verification-dialog {
        max-width: 420px;
        width: 96%;
        margin: 0 auto;

        .timer-text {
          color: #ff6b6b;
          font-size: 14px;
          margin-top: 10px;
        }

        .footer-buttons {
          display: flex;
          gap: 5px;
        }
      }
    `
  ]
})
export class OtpVerificationDialogComponent implements OnInit {
  otp: string = ''
  resent: boolean = false
  errorMessage: string = ''
  loading: boolean = false
  timerStarted: boolean = false
  countdown: number = 30

  @Input() email: string

  constructor(
    private usersService: UserData,
    private toastService: MyToastService,
    protected dialogRef: NbDialogRef<OtpVerificationDialogComponent>,
    @Inject(NB_DIALOG_CONFIG) config: any
  ) {}

  ngOnInit() {
    this.startTimer()
  }

  // Submit OTP for verification
  verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.toastService.showToast('Please enter a valid 6-digit OTP', 'Warning', 'warning')
      return
    }

    this.loading = true

    this.usersService.verifyOTP(this.email, this.otp).subscribe({
      next: (response: any) => {
        this.loading = false
        if (response.message === 'OTP verified successfully') {
          this.toastService.showToast('OTP verified successfully', 'Success', 'success')
          this.dialogRef.close('yes')
        } else {
          this.toastService.showToast('Incorrect OTP. Please try again.', 'Error', 'danger')
        }
      },
      error: error => {
        this.loading = false
      }
    })
  }

  // Resend OTP and start timer
  resendOtp() {
    this.loading = true

    // Resend OTP logic here (you can call your API to resend OTP)
    this.usersService.generateOTP(this.email).subscribe({
      next: () => {
        this.toastService.showToast('OTP has been resent to your email.', 'Success', 'success')
        this.loading = false
        this.resent = true
      },
      error: error => {
        console.error('Error resending OTP:', error)
        this.loading = false
      }
    })
  }

  // Start countdown timer for 30 seconds
  startTimer() {
    this.timerStarted = true
    const countdown$ = interval(1000) // Emit every second

    countdown$.subscribe(seconds => {
      const timeRemaining = 30 - seconds
      if (timeRemaining >= 0) {
        this.countdown = timeRemaining
      }
      if (timeRemaining === 0) {
        this.timerStarted = false // Re-enable Resend OTP button
      }
    })
  }

  // Cancel and close the dialog
  cancel() {
    this.dialogRef.close('no') // Close the dialog and return 'false'
  }
}
