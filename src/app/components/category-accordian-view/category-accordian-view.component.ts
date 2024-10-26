import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {CategoriesApi} from '../../services/apis/categories.service'
import {Category} from './../../admin-pages/categories/categories.interface'
import {NotesApi} from 'app/services/apis/notes.service'
import {VideosApi} from 'app/services/apis/videos.service'

@Component({
  selector: 'category-accordian-view',
  templateUrl: './category-accordian-view.component.html',
  styleUrls: ['./category-accordian-view.component.scss']
})
export class CategoryAccordianViewComponent implements OnInit {
  @Input() type: string
  @Input() openAccordianCategoryId: any
  @Output() submitItems = new EventEmitter<any>()
  categories
  constructor(private notesService: NotesApi, private videosService: VideosApi) {}

  ngOnInit(): void {
    this.getDashboardCategoires()
  }

  private getDashboardCategoires() {
    if (this.type === 'Guides') {
      this.notesService.getDashboardCategoires().subscribe((categoires: Category[]) => {
        this.assignCategories(categoires)
      })
    } else {
      this.videosService.getDashboardCategoires().subscribe((categoires: Category[]) => {
        this.assignCategories(categoires)
      })
    }
  }

  assignCategories(categoires) {
    this.categories = []
    categoires.map(item => {
      this.categories.push({...item, ...{expanded: this.openAccordianCategoryId === item.id ? true : false}})
    })
  }

  itemClicked(category, subCategory) {
    const sendData = {
      category: category,
      subCategory: subCategory
    }
    this.submitItems.emit(sendData)
  }
}
