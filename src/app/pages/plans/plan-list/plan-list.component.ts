import { Component, OnInit } from '@angular/core';
import {NbToastrService} from '@nebular/theme'
import {PlansApi} from 'app/services/apis/plans.service'
import { DefaultEditor } from 'ng2-smart-table';
import {PlanStatusListWithTitle} from '../plans.interface'

@Component({
  selector: 'ngx-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {

  tableColumns: any = {}
  tableSettings: any
  plans = [];
  type = 'subscription'

  constructor(
    private toasterService: NbToastrService,
    private plansApi: PlansApi,
    ) {
    this.initalizeTableSettings()
  }

  changeTab(data) {
    this.type = data.tabId;
    this.plans = [];
    this.getPlans();
    this.initializeTableColumns();
  }

  ngOnInit(): void {
  }

  getPlans() {
    const query = {
      type: this.type,
    }
    this.plansApi.list(query).subscribe((plans: any[]) => {
      this.plans = plans
    })
  }

  private initalizeTableSettings() {
    this.tableSettings = {
      actions: {
        columnTitle: 'Actions',
        add: true,
        edit: true,
        delete: true
      }
    }
  }

  private initializeTableColumns() {
    this.tableColumns = {
      name: {
        title: 'Name',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true
      },
      price: {
        title: 'Price',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true,
        editor: {
          type: 'custom',
          component: CustomNumberEditorComponent
        }
      },
      discount: {
        title: 'Discount(%)',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true,
        editor: {
          type: 'custom',
          component: CustomNumberEditorComponent,
          config: {
            minValue: 0,
            maxValue: 100
          }
        }
      },
      duration: {
        title: 'Duration(Days)',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true,
        editor: {
          type: 'custom',
          component: CustomNumberEditorComponent
        }
      },
      isActive: {
        title: 'Status',
        editable: false,
        filter: {
          type: 'list',
          config: {
            selectText: 'Status',
            list: PlanStatusListWithTitle
          }
        },
        valuePrepareFunction: (cell, row) => {
          return row.isActive ? 'Active' : 'Inactive';
        }
      },
    }
    if (this.type === 'subscription') {
      this.tableColumns['assessments'] = {
        title: 'Assessments',
        type: 'string',
        isRequired: true,
        sort: true,
        sortDirection: 'asc',
        editable: true,
        editor: {
          type: 'custom',
          component: CustomNumberEditorComponent
        },
        valuePrepareFunction: (cell, row) => {
          return row.features && row.features.assessments ? row.features.assessments : 0;
        }
      }
    }
  }

  removePlan(event) {
    this.plansApi.delete(event.id).subscribe(res => {
      this.plans = this.plans.filter(plan => plan.id !== event.id)
      this.toasterService.success('', 'Item deleted successfully')
    })
  }

  addPlan(event) {
    const sendData = {...event, ...{isActive: true, type: this.type}}
    if (this.type === 'subscription') {
      sendData['features'] = {
        tutor: true,
        notes: true,
        videos: true,
        flashCards: true,
        assessments: event.assessments
      }
    }
    this.plansApi.add(sendData).subscribe(res => {
      if (res) {
        this.plans = [...this.plans, res]
        this.toasterService.success('', 'Item added successfully')
      }
    })
  }

  updatePlan(event) {
    const sendData = event;
    if (this.type === 'subscription') {
      sendData['features'] = {
        tutor: true,
        notes: true,
        videos: true,
        flashCards: true,
        assessments: event.assessments
      }
    }
    this.plansApi.update(event).subscribe(res => {
      if (res) {
        this.plans = this.plans.map(plan => {
          if (plan.id === event.id) {
            plan = event
          }
          return plan
        })
        this.toasterService.success('', 'Item updated successfully')
      }
    })
  }
}
@Component({
  template: `
    <input
      type="number"
      [ngModel]="cell.getValue()"
      (ngModelChange)="updateValue($event)"
      class="form-control"
    />
    <div *ngIf="showError" class="text-danger">
      {{ errorMessage }}
    </div>
  `
})
export class CustomNumberEditorComponent extends DefaultEditor {
  minValue: number = 0;  // Set default min value
  maxValue: number = 1000;  // Set default max value
  showError: boolean = false;
  errorMessage: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    // Extract minValue and maxValue from the column editor config
    this.minValue = this.cell.getColumn().editor.config.minValue || 0;  // Default to 1 if not provided
    this.maxValue = this.cell.getColumn().editor.config.maxValue || 100000;  // Default to 100 if not provided
  }

  updateValue(value: any) {
    if (value < this.minValue) {
      this.showError = true;
      this.errorMessage = `Value cannot be less than ${this.minValue}`;
    } else if (value > this.maxValue) {
      this.showError = true;
      this.errorMessage = `Value cannot be greater than ${this.maxValue}`;
    } else {
      this.showError = false;
      this.cell.newValue = value;  // Update value only if valid
    }
  }
}