/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Category, SubCategory} from '../../categories/categories.interface'

export interface Note {
  _id?: string
  id?: string
  title: string
  fileUrl: string
  thumbnailUrl: string
  category?: string | Category
  subCategory?: string | SubCategory
}

