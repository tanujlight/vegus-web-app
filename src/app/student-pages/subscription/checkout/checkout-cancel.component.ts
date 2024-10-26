import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-checkout-cancel',
  styleUrls: ['./checkout.component.scss'],
  template: `
    <div class="row checkout-cancel-container">
      <div class="col-md-12">
        <nb-card>
          <nb-card-body>
            <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
              <h2 class="title">Payment Canceled</h2>
              <small class="sub-title"
                >Your payment process was canceled. If you wish to retry, please click the button below.</small
              >
              <button nbButton matRipple fullWidth (click)="retryPurchase()" type="button" class="home-button">
                Retry Purchase
              </button>
            </div>
          </nb-card-body>
        </nb-card>
      </div>
    </div>
  `
})
export class CheckoutCancelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  retryPurchase() {
    window.location.href = '/student/subscription/plans'
  }
}
