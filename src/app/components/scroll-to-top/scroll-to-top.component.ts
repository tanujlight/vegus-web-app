import {Component, OnInit} from '@angular/core'
import {NbLayoutScrollService} from '@nebular/theme'

@Component({
  selector: 'ngx-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {
  showScrollButton = false

  constructor(private scrollService: NbLayoutScrollService) {}

  ngOnInit() {
    this.scrollService.onScroll().subscribe(async event => {
      // You can extract scroll information from the event object
      const scrollY = event.target.scrollTop

      this.showScrollButton = scrollY > 300
    })
  }

  scrollToTop(): void {
    this.scrollService.scrollTo(0, 0)
  }
}
