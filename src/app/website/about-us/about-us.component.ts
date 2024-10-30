import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    }
  }
}
