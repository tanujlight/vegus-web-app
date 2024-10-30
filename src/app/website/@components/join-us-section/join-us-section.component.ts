import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'ngx-website-join-us-section',
  templateUrl: './join-us-section.component.html',
  styleUrls: ['./join-us-section.component.scss']
})
export class JoinUsSectionComponent implements OnInit {
  @Input()
  text: string = `Your dream of becoming a registered nurse is within reach. Enroll in Rudraa Academy NCLEX-RN Exam Coaching
            Center today and take the first step towards passing your exam on your first attempt.`

  constructor() {}

  ngOnInit(): void {}
}
