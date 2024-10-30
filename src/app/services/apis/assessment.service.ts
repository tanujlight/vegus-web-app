import {Injectable} from '@angular/core'
import {HttpService} from '../../@core/backend/common/api/http.service'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private readonly apiController: string = 'assessments'
  constructor(private api: HttpService) {}

  createAssessment(data: any): Observable<any> {
    return this.api.post(`${this.apiController}`, data).pipe(
      map((res: any) => {
        return res
      })
    )
  }

  get examsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
    return this.api.get(`${this.apiController}`, {params}).pipe(map(data => data))
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
      map(data => {
        return data
      })
    )
  }

  getView(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}/view`).pipe(
      map(data => {
        return data
      })
    )
  }

  delete(id: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${id}`)
  }

  update(item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${item.id}`, item)
  }

  deleteQuestionAndCaseStudy(assessmentId: string, questionAndCaseStudyId: string): Observable<any> {
    return this.api.delete(`${this.apiController}/${assessmentId}/questionsAndCaseStudies/${questionAndCaseStudyId}`)
  }

  addQuestionAndCaseStudy(assessmentId: string, newQuestionsAndCaseStudies: any): Observable<any> {
    return this.api.put(`${this.apiController}/${assessmentId}/questions-and-case-studies`, newQuestionsAndCaseStudies)
  }
}
