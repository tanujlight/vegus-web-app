import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {User} from 'app/@core/interfaces/common/users'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-website-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User

  constructor(private router: Router, protected userStore: UserStore) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
  }

  isActive(route: string): boolean {
    return this.router.url === route
  }

  goToDashboard() {
    if (this.user.role === 'admin') {
      this.router.navigateByUrl('/admin/dashboard')
    } else if (this.user.role === 'user' || this.user.role === 'subscriber') {
      this.router.navigateByUrl('/student/dashboard')
    }
  }

  goToSignIn() {
    const userRole = this.userStore.getUser()?.role || ''

    if (userRole === 'admin') {
      this.router.navigateByUrl('/admin/dashboard')
    } else if (userRole === 'user' || userRole === 'subscriber') {
      this.router.navigateByUrl('/student/dashboard')
    } else {
      this.router.navigateByUrl('/auth/register')
    }
  }

  navigateToSection(sectionId: string) {
    if (this.router.url === '/') {
      // If already on the homepage, scroll to the section
      this.scrollToSection(sectionId)
    } else {
      // Navigate to the homepage and pass the section ID
      this.router.navigate(['/'], {fragment: sectionId}).then(() => {
        setTimeout(() => {
          this.scrollToSection(sectionId)
        }, 200) // Delay to allow the page to render
      })
    }
  }

  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }
}
