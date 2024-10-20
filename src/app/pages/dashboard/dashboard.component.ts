import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core'
import {Router} from '@angular/router'
import {User, UserData} from 'app/@core/interfaces/common/users'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  user: User = null

  result = {
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalCategories: 0,
    totalCaseStudies: 0,
    totalFlashCards: 0
  }

  constructor(
    private router: Router,
    private usersService: UserData,
    private userStore: UserStore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
    this.usersService.getDashboardData().subscribe(data => {
      if (data) {
        this.result = data
        // Manually trigger change detection
        this.cdr.detectChanges()
      }
    })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }
}
