/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table'
import {MyToastService} from 'app/services/my-toast.service'
import {ConfirmDialogComponent} from '../confirmation-dialog/confirmation-dialog.component'
import {Router} from '@angular/router'

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit, OnChanges {
  totalItemsCount = 0
  @Input() title: String
  @Input() tableCommonFilters: [] = []
  @Input() columns: {}
  @Input() tableSettings = {}
  @Input() addButton: string = ''
  @Input() data: any[] = []
  @Input() tableActions: any[] = []

  @Input() isServerSide: boolean = false

  @Input() dataSource: any

  @Output() removeEvent = new EventEmitter<any>()
  @Output() updateEvent = new EventEmitter<any>()
  @Output() createEvent = new EventEmitter<any>()
  @Output() filterChangeEvent = new EventEmitter<any>()
  @Output() onCustomAction = new EventEmitter<any>()
  @Output() onUserRowSelect = new EventEmitter<any>()

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus" data-toggle="tooltip" data-placement="top" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" data-toggle="tooltip" data-placement="top" title="Save"></i>',
      cancelButtonContent: '<i class="nb-close" data-toggle="tooltip" data-placement="top" title="Cancel"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" data-toggle="tooltip" data-placement="top" title="Save"></i>',
      cancelButtonContent: '<i class="nb-close" data-toggle="tooltip" data-placement="top" title="Cancel"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete"></i>',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {}
  }

  source: LocalDataSource | ServerDataSource | any

  constructor(
    private cdr: ChangeDetectorRef,
    private myToastService: MyToastService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.settings.columns = this.columns

    if (this.isServerSide && this.dataSource) {
      this.source = this.dataSource
      this.syncTotalCount()
    } else {
      this.source = new LocalDataSource(this.data)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue !== changes.data.previousValue) {
      this.loadTableSource(this.data)
    }

    if (changes && changes.dataSource && changes.dataSource.currentValue !== changes.dataSource.previousValue) {
      this.source = this.dataSource
      this.syncTotalCount()
    }

    if (changes && changes.columns) {
      this.settings.columns = this.columns
      this.settings = Object.assign({}, this.settings)
    }

    if (changes && changes.tableSettings) {
      this.settings = Object.assign({}, this.settings, this.tableSettings)
    }
  }

  tableCommonFiltersChange(e, filter) {
    filter.selected = e
    this.filterChangeEvent.emit(filter)
  }

  private syncTotalCount() {
    if (this.source) {
      this.source.onChanged().subscribe(e => {
        this.totalItemsCount = this.source.lastRequestCount
      })
    }
  }

  loadTableSource(data) {
    if (data && data.length) {
      const sourceData = JSON.parse(JSON.stringify(data))
      this.totalItemsCount = sourceData.length
      this.source = new LocalDataSource(sourceData)
    } else {
      this.source = new LocalDataSource()
    }
  }

  onDeleteConfirm(event): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to delete?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.removeEvent.emit(event.data)
        } else {
          event.confirm.reject()
        }
      })
  }

  onEditConfirm(event): void {
    if (this.checkValidation(event.newData)) {
      this.updateEvent.emit(event.newData)
      event.confirm.resolve()
    }
  }

  onCreateConfirm(event): void {
    if (this.checkValidation(event.newData)) {
      this.createEvent.emit(event.newData)
      event.confirm.resolve()
    }
  }

  changePager(e) {
    this.source.setPaging(1, e)
  }

  checkValidation(data) {
    let isValid = true

    const keys = Object.keys(this.columns)

    const keysLg = keys.length

    for (let i = 0; i < keysLg; i++) {
      const k = keys[i]
      if (this.columns[k].isRequired && !data[k]) {
        isValid = false
        const title = `Missing required field`
        const content = `${this.columns[k].title} is required!`
        this.myToastService.showToast(content, title, 'warning')
        break
      }
    }

    return isValid
  }

  routeTo(path: string): void {
    this.router.navigateByUrl(path)
  }
}
