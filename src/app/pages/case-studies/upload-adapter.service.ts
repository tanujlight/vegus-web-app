/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {HttpService} from '../../@core/backend/common/api/http.service'

@Injectable()
export class UploadAdapter {
  private readonly apiController: string = 'casestudies'
  loader: any
  id: string

  constructor(private api: HttpService) {}

  setLoader(loader: any) {
    this.loader = loader
  }

  setId(id: string) {
    this.id = id
  }

  async upload() {
    return this.loader.file.then(file => {
      return new Promise((resolve, reject) => {
        try {
          this.uploadFile(this.id, file).subscribe(res => {
            // Call the uploadFunction to upload the file
            resolve({
              default: res.fileUrl
            })
          })
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  private uploadFile(id: string, file: File): Observable<any> {
    const maxFileSize = 1 * 1024 * 1024 // Maximum file size in bytes (1MB)
    if (file.size > maxFileSize) {
      // Throw an error or handle the case where the file size exceeds the limit
      throw new Error('File size exceeds the maximum limit of 1MB.')
    }
    const formData = new FormData()
    formData.append('file', file)
    return this.api.put(`${this.apiController}/${id}/upload-file`, formData)
  }
}
