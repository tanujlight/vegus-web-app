import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {TextEditorComponent} from './text-editor.component'
import {CKEditorModule} from '@ckeditor/ckeditor5-angular'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {TextEditorUploadAdapter} from './text-editor-upload-adapter.service'

@NgModule({
  imports: [CommonModule, ThemeModule, CKEditorModule, ngFormsModule, ReactiveFormsModule],
  exports: [TextEditorComponent],
  declarations: [TextEditorComponent],
  providers: [TextEditorUploadAdapter]
})
export class TextEditorModule {}
