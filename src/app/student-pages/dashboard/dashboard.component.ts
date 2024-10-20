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

  constructor(private router: Router, private userStore: UserStore, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }
}
