import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading = new BehaviorSubject(false)

  public showLoader = new BehaviorSubject(true)
  public isLoadingOverload = new BehaviorSubject({isLoading: false, message: ''})
  constructor() {}
}
