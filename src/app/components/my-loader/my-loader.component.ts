// my-loader.component.ts
import {Component, OnInit} from '@angular/core'
import {LoaderService} from '../../services/loader.service'

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss']
})
export class MyLoaderComponent implements OnInit {
  loadingMessage: string = 'Please wait...'
  loading: boolean
  overloaded: boolean = false

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe(v => {
      this.change(v)
    })
    this.loaderService.isLoadingOverload.subscribe(v => {
      this.overloaded = v.isLoading
      this.loadingMessage = v.message || 'Please wait...'
      this.change(this.loading)
    })
  }

  change(data) {
    if (this.overloaded) {
      this.loading = true
    } else {
      this.loading = data
    }
  }

  ngOnInit() {}
}
