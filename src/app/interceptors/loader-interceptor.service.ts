// loader-interceptor.service.ts
import {Injectable} from '@angular/core'
import {HttpResponse, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http'
import {MyToastService} from '../services/my-toast.service'
import {Observable} from 'rxjs'
import {LoaderService} from '../services/loader.service'

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = []

  constructor(private loaderService: LoaderService, private myToastService: MyToastService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req)
    if (i >= 0) {
      this.requests.splice(i, 1)
    }
    this.loaderService.isLoading.next(this.requests.length > 0)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req)

    if (this.loaderService.showLoader.value === true) {
      this.loaderService.isLoading.next(true)
    }

    return new Observable(observer => {
      const subscription = next.handle(req).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req)
            observer.next(event)
          }
        },
        err => {
          let message = ''

          if (err && err.error) {
            if (err.error.error) {
              message = err.error.error
            } else {
              message = err.error.message || 'Something went wrong!, Please try again with correct values'
            }

            if (message === 'Invalid token format' || message === 'Unauthorized') {
            } else {
              this.myToastService.showToast(message, 'Error', 'danger')
            }
          }

          this.removeRequest(req)
          observer.error(err)
        },
        () => {
          this.removeRequest(req)
          observer.complete()
        }
      )
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req)
        subscription.unsubscribe()
      }
    })
  }
}
