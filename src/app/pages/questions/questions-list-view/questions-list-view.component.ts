import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CategoriesApi } from 'app/services/apis/categories.service'
import { QuestionsApi } from 'app/services/apis/questions.service'
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { QuestionComponent } from '../question/question.component';
import { QuestionAndCaseStudy } from 'app/pages/exams/exams.interface';

@Component({
  selector: 'ngx-questions-list-view',
  templateUrl: './questions-list-view.component.html',
  styleUrls: ['./questions-list-view.component.scss']
})
export class QuestionsListViewComponent implements OnInit {
  category = ''
  subCategory = ''

  allCategories = []
  allSubCategories = []
  pageNumber = 1;
  question
  totalQuestionCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionsApi: QuestionsApi,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi
  ) { }

  async ngOnInit() {
    await this.getCategoires()
    await this.syncQueryParams()
    this.getQuestion()
  }


  getQuestion() {
    if (this.totalQuestionCount && this.totalQuestionCount < this.pageNumber) {
      this.toasterService.danger('', `Enter correct index`)
      return;
    }
    const sendData = {
      pageNumber: this.pageNumber,
      pageSize: 1,
      category: this.category,
      subCategory: this.subCategory,
    }
    this.questionsApi.list(sendData).subscribe((res: any) => {
      if (res && res.items && res.items.length) {
        this.question = res.items[0];
        this.totalQuestionCount = res.totalCount;
      } else {
        this.question = null;
        this.totalQuestionCount = 0;
      }
    })
  }

  private async getCategoires() {
    this.allCategories = await firstValueFrom(this.categoriesService.getCategories())
  }

  private async syncQueryParams() {
    return new Promise((resolve, reject) => {
      this.route.queryParams.subscribe(params => {
        this.category = params?.category || ''
        this.subCategory = params?.subCategory || ''

        if (params.category) {
          this.allSubCategories =
            this.allCategories.find(category => category.id === this.category)?.subCategories || []
        }

        resolve(true)
      })
    })
  }

  private setQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.category,
        subCategory: this.subCategory
      }
    })
  }

  categoryChange() {
    if (this.category) {
      this.subCategory = ''
      this.allSubCategories = []
      this.allSubCategories = this.allCategories.find(category => category.id === this.category)?.subCategories || []
      this.setQueryParams()
      this.pageNumber = 1;
      this.getQuestion()
    }
  }

  subCategoryChange() {
    if (this.category && this.subCategory) {
      this.setQueryParams()
      this.pageNumber = 1;
      this.getQuestion()
    }
  }
  nextBtnClicked() {
    this.pageNumber += 1;
    this.getQuestion()
  }
  prevBtnClicked() {
    this.pageNumber -= 1;
    this.getQuestion()
  }

  editItem() {
    this.dialogService
      .open(QuestionComponent, {
        context: {
          isDialog: true,
          questionItemId: this.question._id,
        },
        dialogClass: 'question-component-dialog-container',
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(addedQuestion => {
        if (addedQuestion) {
          this.getQuestion();
        }
      })
  }

}
