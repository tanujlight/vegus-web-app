/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {FlashCardsApi} from 'app/services/apis/flash-cards.service'

@Injectable()
export class TextEditorUploadAdapter {
  loader: any
  id: string

  module: string

  constructor(public questionsService: QuestionsApi, public flashCardsService: FlashCardsApi) {}

  setLoader(loader: any) {
    this.loader = loader
  }

  setId(id: string) {
    this.id = id
  }

  setModule(module: string) {
    this.module = module
  }

  async upload() {
    return this.loader.file.then(file => {
      return new Promise((resolve, reject) => {
        if (this.module === 'question') {
          this.questionsService.uploadFile(this.id, file).subscribe(res => {
            // Call the uploadFunction to upload the file
            resolve({
              default: res.fileUrl
            })
          })
        } else if (this.module === 'flashCard') {
          this.flashCardsService.uploadFile(this.id, file).subscribe(res => {
            // Call the uploadFunction to upload the file
            resolve({
              default: res.fileUrl
            })
          })
        }
      })
    })
  }
}
