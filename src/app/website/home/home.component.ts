import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {User} from 'app/@core/interfaces/common/users'
import {NbAuthService} from '@nebular/auth'
import {UserStore} from 'app/@core/stores/user.store'
import {PlansApi} from 'app/services/apis/plans.service'
import {LoaderService} from 'app/services/loader.service'

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User
  plans = []
  openItemIndex: number | null = null
  faqItems = [
    {
      question: 'Does Vegus have NGN Questions?',
      answer:
        'Yes! Vegus has over 1000 next generation NCLEX questions available to ALL members of our NCLEX prep course.'
    },
    {
      question: 'How long does it take to view all NCLEX Review Lecture Series videos?',
      answer:
        'We recommend watching no more than 3 hours of content per day while also taking out time for taking 50 practice questions. While you listen to video u can also take advantage of the note provided in the course.'
    },
    {
      question: 'How many months should you prepare for NCLEX?How does Coda AI use my data?',
      answer:
        'The standard average time for preparation is 3 to 4 months, it also depends on various factors like your time spent, focus, retention and smart work.'
    }
  ]

  constructor(
    protected userStore: UserStore,
    private loaderService: LoaderService,
    private router: Router,
    private plansApi: PlansApi,
    private authService: NbAuthService
  ) {}

  // faq section
  toggleItem(index: number): void {
    this.openItemIndex = this.openItemIndex === index ? null : index
  }
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.user = this.userStore.getUser()

        if (this.user && this.user.role === 'admin') {
          this.router.navigateByUrl('/admin/dashboard')
        } else if (this.user && (this.user.role === 'user' || this.user.role === 'subscriber')) {
          this.router.navigateByUrl('/student/dashboard')
        }
      }
    })

    this.getPlans()
  }

  getPlans() {
    this.loaderService.showLoader.next(false)

    const query = {
      type: 'subscription'
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

      this.setShowLoaderToTrue()
    })
  }

  goToSignUp() {
    const userRole = this.userStore.getUser()?.role || ''

    if (userRole === 'admin') {
      this.router.navigateByUrl('/admin/dashboard')
    } else if (userRole === 'user' || userRole === 'subscriber') {
      this.router.navigateByUrl('/student/dashboard')
    } else {
      this.router.navigateByUrl('/auth/register')
    }
  }

  private setShowLoaderToTrue() {
    setTimeout(() => {
      this.loaderService.showLoader.next(true)
    }, 200)
  }
}
