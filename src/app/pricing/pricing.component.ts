import { Component, OnInit } from '@angular/core';
import { PlansApi } from 'app/services/apis/plans.service';

@Component({
  selector: 'ngx-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  pricing = []
  constructor(
    private plansApi: PlansApi,
  ) { }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans() {
    const query = {
      type: 'subscription',
    }
    this.plansApi.list(query).subscribe((plans: any[]) => {
      this.pricing = plans
    })
  }

}
