import {Component, OnInit} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {PlansApi} from 'app/services/apis/plans.service'

@Component({
  selector: 'ngx-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans = []
  type = 'subscription'

  constructor(private toasterService: NbToastrService, private plansApi: PlansApi) {}

  ngOnInit(): void {
    this.getPlans()
  }

  changeTab(data) {
    this.type = data.tabId
    this.plans = []
    this.getPlans()
  }

  buyPlan(plan) {
    const via = 'stripe'

    this.plansApi.initializePayment({planId: plan.id, via: via}).subscribe(data => {
      if (via === 'stripe') {
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
