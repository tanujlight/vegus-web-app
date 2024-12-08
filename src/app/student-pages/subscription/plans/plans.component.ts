import {Component, OnInit, ChangeDetectorRef} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {NbToastrService} from '@nebular/theme'
import {User} from 'app/@core/interfaces/common/users'
import {UserStore} from 'app/@core/stores/user.store'
import {PlansApi} from 'app/services/apis/plans.service'

@Component({
  selector: 'ngx-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans = []
  type: 'subscription' | 'renewal'

  user: User

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private plansApi: PlansApi,
    private userStore: UserStore,
    private cdref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.type = params?.type || 'subscription'
      this.getPlans()
      this.cdref.detectChanges()
    })

    this.user = this.userStore.getUser()
  }

  changeTab(data) {
    this.type = data.tabId
    this.plans = []
    this.getPlans()
  }

  buyPlan(plan) {
    let via = 'stripe'

    // For Indian users we will use Razorpay
    if (this.user.address.country === 'India') {
      via = 'razorpay'
    }

    this.plansApi.initializePayment({planId: plan.id, via: via}).subscribe(data => {
      if (via === 'razorpay') {
        // Redirect the user to the Razorpay Checkout page
        window.location.href = data.paymentLink.short_url
      } else if (via === 'stripe') {
        // Redirect the user to the Stripe Checkout page
        window.location.href = data.url
      }
    })
  }

  getPlans() {
    const query = {
      type: this.type
    }
    this.plansApi.list(query).subscribe((plans: any[]) => {
      this.plans = plans.map(p => {
        p.hasDiscount = false

        if (p.discount) {
          p.hasDiscount = true
          const discountAmount = (p.discount / 100) * p.price

          p.finalPrice = p.price - discountAmount
        }

        return p
      })
    })
  }
}
