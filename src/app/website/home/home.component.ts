import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  constructor(protected userStore: UserStore, private router: Router) {}

  // faq section
  toggleItem(index: number): void {
    this.openItemIndex = this.openItemIndex === index ? null : index
  }
  ngOnInit(): void {}

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
}
