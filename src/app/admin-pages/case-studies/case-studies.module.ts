import {NgModule} from '@angular/core'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {AuthModule} from '../../@auth/auth.module'
import {ComponentsModule} from '../../@components/components.module'
import {MatTabsModule} from '@angular/material/tabs'
import {CaseStudiesApi} from '../../services/apis/case-studies.service'

import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbTabsetModule,
  NbStepperModule,
  NbCheckboxModule,
  NbDialogModule,
  NbAccordionModule
} from '@nebular/theme'

import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {CaseStudiesRoutingModule, routedComponents} from './case-studies-routing.module'
import {UploadAdapter} from './upload-adapter.service'
import {CategoriesModule} from '../categories/categories.module'
import {CKEditorModule} from '@ckeditor/ckeditor5-angular'
import {QuestionsModule} from '../questions/questions.module'
import {CaseStudyViewComponent} from './case-study-view/case-study-view.component'
import {CaseStudyViewRendererComponent} from './case-study-view-renderer/case-study-view-renderer.component'
import {QuestionTypeViewModule} from '../../components/question-type-view/question-type-view.module'
import {ScrollToTopModule} from 'app/components/scroll-to-top/scroll-to-top.module'
import {CaseStudiesListViewComponent} from './case-studies-list-view/case-studies-list-view.component'
import {CaseStudyComponent} from './case-study/case-study.component'

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbTabsetModule,
  NbStepperModule,
  NbCheckboxModule,
  NbDialogModule.forChild(),
  NbAccordionModule
]

@NgModule({
  declarations: [
    ...routedComponents,
    CaseStudyViewComponent,
    CaseStudyViewRendererComponent,
    CaseStudiesListViewComponent
  ],
  imports: [
    CommonModule,
    CaseStudiesRoutingModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ReactiveFormsModule,
    ngFormsModule,
    MatTabsModule,
    SmartTableModule,
    CategoriesModule,
    QuestionsModule,
    ScrollToTopModule,
    CKEditorModule,
    QuestionTypeViewModule,
    ...NB_MODULES
  ],
  entryComponents: [CaseStudyViewComponent, CaseStudyComponent],
  providers: [UploadAdapter, CaseStudiesApi],
  exports: [CaseStudyViewComponent, CaseStudyViewRendererComponent]
})
export class CaseStudiesModule {}
