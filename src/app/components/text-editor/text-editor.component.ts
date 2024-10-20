import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core'
import * as Editor from '../../../assets/ckeditor/build/ckeditor.js'
import {TextEditorUploadAdapter} from './text-editor-upload-adapter.service'

@Component({
  selector: 'ngx-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnChanges {
  @Input() editorValue: string = ''
  @Input() id: string
  @Input() module: string
  @Output() editorValueChange = new EventEmitter<string>()

  public editor = Editor

  constructor(private textEditorUploadAdapter: TextEditorUploadAdapter) {}

  ngOnInit(): void {
    this.textEditorUploadAdapter.setId(this.id)
    this.textEditorUploadAdapter.setModule(this.module)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id && changes.id.currentValue !== changes.id.previousValue) {
      this.textEditorUploadAdapter.setId(this.id)
    }

    if (changes.module && changes.module.currentValue !== changes.module.previousValue) {
      this.textEditorUploadAdapter.setModule(this.module)
    }
  }

  onEditorReady(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      this.textEditorUploadAdapter.setLoader(loader)

      return this.textEditorUploadAdapter
    }
  }

  onEditorChange(event: any) {
    if (event?.editor) {
      this.editorValueChange.emit(event.editor.getData())
    }
  }
}
