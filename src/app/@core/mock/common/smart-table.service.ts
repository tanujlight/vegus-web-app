/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {SmartTableData} from '../../interfaces/common/smart-table'

@Injectable()
export class SmartTableService extends SmartTableData {
  data = [
    {
      id: 1,
      firstName: 'Mark',
      lastName: 'Otto',
      login: '@mdo',
      email: 'mdo@gmail.com'
    }
  ]

  getData() {
    return this.data
  }
}
