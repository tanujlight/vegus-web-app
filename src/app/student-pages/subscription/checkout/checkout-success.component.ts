import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Router} from '@angular/router'
import {InitUserService} from 'app/@theme/services/init-user.service'
import {STUDENT_ROUTES} from 'app/constants/routes'
import {PlansApi} from 'app/services/apis/plans.service'

@Component({
  selector: 'ngx-checkout-success',
  styleUrls: ['./checkout.component.scss'],
  template: `
    <div class="row checkout-success-container">
      <div class="col-md-12">
        <nb-card>
          <nb-card-body>
            <div *ngIf="!isLoading && paymentVerified" class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
              <h2 class="title">Payment Successful!</h2>
              <small class="sub-title"
                >Thank you for your purchase. Your payment has been successfully processed.</small
              >
              <button nbButton matRipple fullWidth (click)="goToHome()" type="button" class="home-button">
                Go to Dashboard
              </button>
            </div>

            <div *ngIf="!isLoading && !paymentVerified" class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
              <h2 class="title">Error</h2>
              <small class="sub-title"
                >Something went wrong while verifying your payment. Please contact support with your payment
                details.</small
              >
              <button nbButton matRipple fullWidth (click)="reverify()" type="button" class="home-button">
                Reverify payment
              </button>
            </div>
          </nb-card-body>
        </nb-card>
      </div>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  isLoading = true
  paymentVerified = false

  sessionId: string

  constructor(
    private router: Router,
    protected initUserService: InitUserService,
    private route: ActivatedRoute,
    private plansApi: PlansApi
  ) {}

  ngOnInit(): void {
    // Get session_id from URL
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id']

      // Verify the payment
      this.verifyPayment()
    })
  }

  goToHome() {
    this.initUserService.initCurrentUser().subscribe((data: any) => {
      this.router.navigateByUrl(STUDENT_ROUTES.DASHBOARD, {replaceUrl: true})
    })
  }

  reverify() {
    this.isLoading = true
    this.verifyPayment()
  }

  verifyPayment() {
    this.plansApi.verifyStripeSession({sessionId: this.sessionId}).subscribe(
      (data: any) => {
        this.isLoading = false
        this.paymentVerified = data.success
      },
      () => {
        this.isLoading = false
        this.paymentVerified = false
      }
    )
  }
}
