/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService} from '@nebular/theme'

@Injectable()
export class MyToastService {
  constructor(private toastrService: NbToastrService) {}

  showToast(body: any, title?: string, type?: NbComponentStatus, duration = 3000) {
    const destroyByClick = true
    const icon = true
    const position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT
    const preventDuplicates = true

    const hasIcon = icon ? {} : {icon: ''}
    const config = {
      status: type || 'basic',
      destroyByClick: destroyByClick,
      duration: duration,
      position: position,
      preventDuplicates: preventDuplicates,
      ...hasIcon
    }
    const titleContent = title ? `${title}` : ''

    this.toastrService.show(body, `${titleContent}`, config)
  }
}
