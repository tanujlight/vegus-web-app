import {Injectable} from '@angular/core'
import {HttpService} from '../../@core/backend/common/api/http.service'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'

@Injectable({
  providedIn: 'root'
})
export class TutuorService {
  private readonly apiController: string = 'tutor'
  constructor(private api: HttpService) {}

  availablePracticeQuestions(): Observable<any> {
    return this.api.get(`${this.apiController}/available-practice-questions`).pipe(
      map(data => {
        return data
      })
    )
  }

  createPracticeTest(item: any): Observable<any> {
    return this.api.post(`${this.apiController}/practice-tests/create`, item)
  }

  getPracticeTests(): DataSource {
    const uriWithParams = `${this.api.apiUrl}/${this.apiController}/practice-tests`
    return this.api.getServerDataSource(uriWithParams)
  }
  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/practice-tests/${id}`).pipe(
      map(data => {
        return data
      })
    )
  }

  /**
   * This method is used to update the practice test
   * For now, it only updates the status and time spent
   */
  updatePracticeTest(
    testId: string,
    params: {
      status: string
      timeSpent: number
      lastActiveQuestionId: string
    }
  ): Observable<any> {
    return this.api.put(`${this.apiController}/practice-tests/${testId}/save`, params)
  }

  /**
   * This method is used to submit the answer to a single question
   * It requires the question, questionAndCaseStudyId and the time spent on the test
   */
  submitAnswer(
    testId: string,
    params: {question: any; questionAndCaseStudyId: string; testTimeSpent: number}
  ): Observable<any> {
    return this.api.put(`${this.apiController}/practice-tests/${testId}/questions/submit-answer`, params)
  }

  /**
   * This method is used to update the state of a question
   * It requires the questionId and the status of the question
   * For now, the we only update the question state to `marked` with this method
   */
  updateQuestionState(
    testId: string,
    params: {
      questionId: string
      status: string
    }
  ): Observable<any> {
    return this.api.put(`${this.apiController}/practice-tests/${testId}/questions/update-state`, params)
  }

  /**
   * This method is used to get the performance report of the user
   */
  getPerformanceReport(): Observable<any> {
    return this.api.get(`${this.apiController}/performance`).pipe(
      map(data => {
        return data
      })
    )
  }
}
