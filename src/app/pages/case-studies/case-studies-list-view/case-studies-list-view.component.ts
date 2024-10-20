import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CategoriesApi } from 'app/services/apis/categories.service'
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CaseStudyComponent } from '../case-study/case-study.component';
import { CaseStudiesApi } from 'app/services/apis/case-studies.service';

@Component({
  selector: 'ngx-case-studies-list-view',
  templateUrl: './case-studies-list-view.component.html',
  styleUrls: ['./case-studies-list-view.component.scss']
})
export class CaseStudiesListViewComponent implements OnInit {
  category = ''
  subCategory = ''

  allCategories = []
  allSubCategories = []
  pageNumber = 1;
  caseStudy
  totalCaseStudyCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseStudiesApi: CaseStudiesApi,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi
  ) { }

  async ngOnInit() {
    await this.getCategoires()
    await this.syncQueryParams()
    this.getCaseStudy()
  }


  getCaseStudy() {
    if (this.totalCaseStudyCount && this.totalCaseStudyCount < this.pageNumber) {
      this.toasterService.danger('', `Enter correct index`)
      return;
    }
    const sendData = {
      pageNumber: this.pageNumber,
      pageSize: 1,
      category: this.category,
      subCategory: this.subCategory,
    }
    this.caseStudy = null;
    this.caseStudiesApi.getCaseStudiesForView(sendData).subscribe((res: any) => {
      if (res && res.items && res.items.length) {
        this.caseStudy = res.items[0];
        this.totalCaseStudyCount = res.totalCount;
      } else {
        this.caseStudy = null;
        this.totalCaseStudyCount = 0;
      }
    })
  }

  private async getCategoires() {
    this.allCategories = await firstValueFrom(this.categoriesService.getCategories())
  }

  private async syncQueryParams() {
    return new Promise((resolve) => {
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
      this.getCaseStudy()
    }
  }

  subCategoryChange() {
    if (this.category && this.subCategory) {
      this.setQueryParams()
      this.pageNumber = 1;
      this.getCaseStudy()
    }
  }

  nextBtnClicked() {
    this.pageNumber += 1;
    this.getCaseStudy()
  }

  prevBtnClicked() {
    this.pageNumber -= 1;
    this.getCaseStudy()
  }

  editItem() {
    this.dialogService
      .open(CaseStudyComponent, {
        context: {
          isDialog: true,
          caseStudyItemId: this.caseStudy._id,
        },
        dialogClass: 'casestudy-component-dialog-container',
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(addedCaseStudy => {
        if (addedCaseStudy) {
          this.getCaseStudy();
        }
      })
  }

}
