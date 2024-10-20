import {Injectable} from '@angular/core'
import {HttpService} from '../../@core/backend/common/api/http.service'
import {map} from 'rxjs/operators'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class NotesApi {
  private readonly apiController: string = 'study-materials/notes'

  constructor(private api: HttpService) {}

  get notesDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<any[]> {
    return this.api.get(`${this.apiController}` + query).pipe(map(data => data))
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
      map(data => {
        return data
      })
    )
  }

  getPreSignedUrl(id: string, data): Observable<any> {
    return this.api.post(`${this.apiController}/${id}/get-presigned-url`, data).pipe(
      map((res: any) => {
        return res
      })
    )
  }

  delete(id: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${id}`)
  }

  add(item: any): Observable<any> {
    return this.api.post(this.apiController, item)
  }

  update(item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${item.id}`, item)
  }

  getDashboardCategoires(): Observable<any[]> {
    return this.api.get(`${this.apiController}/dashboard`).pipe(
      map((data: any[]) => {
        return data
      })
    )
  }
}
