/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import {share} from 'rxjs/operators'
import {Category} from '../../admin-pages/categories/categories.interface'

@Injectable({
  providedIn: 'root'
})
export class CategoriesStore {
  private categoires: Category[] = []

  getCategories(): Category[] {
    return this.categoires
  }

  setCategories(categoires: Category[]) {
    this.categoires = categoires
  }

  removeCategory(id: string) {
    this.categoires = this.categoires.filter(c => c.id !== id)
  }
}
