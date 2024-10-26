import {AfterViewInit, Component, OnDestroy, OnInit, Input} from '@angular/core'
import {TutuorService} from 'app/services/apis/tutuor.service'
import {NbThemeService} from '@nebular/theme'
import {firstValueFrom} from 'rxjs'
import {MeasureConverterPipe} from '../../../@theme/pipes'

import {NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder} from '@nebular/theme'

interface TreeNode<T> {
  data: T
  children?: TreeNode<T>[]
  expanded?: boolean
}

interface FSEntry {
  isSubcategory?: boolean
  name: string
  progress: number
  usage: string
  marks: string
  correct: string
  incorrect: string
  omitted: string
  marked: string
}

@Component({
  selector: 'ngx-tutor-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class TutorPerformanceComponent implements OnInit, AfterViewInit, OnDestroy {
  questionsCountChartOptions: any = {}
  questionsStatusesCountChartOptions: any = {}
  practiceTestsCountChartOptions: any = {}

  questionsMarksChartOptions: any = {}

  categoriesChartOptions: any = {}

  themeSubscription: any
  themeConfig: any
  performanceData: {
    questionsCount: {
      used: number
      unused: number
      total: number
    }
    questionsStatusesCount: {
      correct: number
      incorrect: number
      omitted: number
      marked: number
      total: number
    }
    questionsMarks: {
      totalPossible: number
      totalScored: number
    }
    categories: [
      {
        id: string
        name: string
        uniqueIdentifier: string
        questionsCount: {
          used: number
          total: number
        }
        questionsStatuses: {
          correct: number
          incorrect: number
          omitted: number
          marked: number
        }
        questionsMarks: {
          totalPossible: number
          totalScored: number
        }
        subcategories: [
          {
            id: string
            name: string
            questionsCount: {
              used: number
              total: number
            }
            questionsStatuses: {
              correct: number
              incorrect: number
              omitted: number
              marked: number
              total: number
            }
            questionsMarks: {
              totalPossible: number
              totalScored: number
            }
          }
        ]
      }
    ]
    practiceTestsCounts: {
      created: number
      completed: number
      suspended: number
      resumed: number
      started: number
    }
  }

  customColumn = 'name'
  defaultColumns = ['usage', 'marks', 'correct', 'incorrect', 'omitted', 'marked']
  allColumns = [this.customColumn, ...this.defaultColumns]

  dataSource: NbTreeGridDataSource<FSEntry>

  sortColumn: string
  sortDirection: NbSortDirection = NbSortDirection.NONE

  private categoriesTreeData: TreeNode<FSEntry>[] = []

  constructor(
    private tutuorService: TutuorService,
    private theme: NbThemeService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    public measureConverterPipe: MeasureConverterPipe
  ) {
    this.dataSource = this.dataSourceBuilder.create(this.categoriesTreeData)
  }

  async ngOnInit() {
    await this.getPerformanceData()
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.themeConfig = config
    })
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe()
  }

  private setQuestionsCountPieChart() {
    const colors = this.themeConfig.variables
    const echarts: any = this.themeConfig.variables.echarts

    this.questionsCountChartOptions = {
      backgroundColor: echarts.bg,
      color: [colors.primaryLight, colors.infoLight],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Used', 'Unused'],
        textStyle: {
          color: echarts.textColor
        }
      },
      series: [
        {
          name: 'Questions',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {value: this.performanceData.questionsCount.used, name: 'Used'},
            {value: this.performanceData.questionsCount.unused, name: 'Unused'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor
            }
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor
              }
            }
          }
        }
      ]
    }
  }

  private setPracticeTestsCountPieChart() {
    const colors = this.themeConfig.variables
    const echarts: any = this.themeConfig.variables.echarts

    this.practiceTestsCountChartOptions = {
      backgroundColor: echarts.bg,
      color: [colors.successLight, colors.primaryLight, colors.infoLight, colors.warningLight],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Completed', 'Suspended', 'Resumed', 'Started'],
        textStyle: {
          color: echarts.textColor
        }
      },
      series: [
        {
          name: 'Practice Tests',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {value: this.performanceData.practiceTestsCounts.completed, name: 'Completed'},
            {value: this.performanceData.practiceTestsCounts.suspended, name: 'Suspended'},
            {value: this.performanceData.practiceTestsCounts.resumed, name: 'Resumed'},
            {value: this.performanceData.practiceTestsCounts.started, name: 'Started'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor
            }
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor
              }
            }
          }
        }
      ]
    }
  }

  private setQuestionsMarksBarChart() {
    const colors = this.themeConfig.variables

    const remainingMarks =
      this.performanceData.questionsMarks.totalPossible - this.performanceData.questionsMarks.totalScored

    this.questionsMarksChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const scored = params[0]
          const remaining = params[1]
          const scoredValue = scored?.value || 0
          const remainingValue = remaining?.value || 0

          const total = scoredValue + remainingValue

          let percentage = '0.0'
          if (total) {
            percentage = ((scoredValue / total) * 100).toFixed(2)
          }

          return `
            <div>
              <strong>${scored.name}</strong><br/>
              ${scored.seriesName}: ${scoredValue}<br/>
              Remaining: ${remainingValue || 0}<br/>
              Total: ${total}<br/>
              Percentage: ${percentage}%
            </div>
          `
        }
      },
      xAxis: {
        type: 'category',
        data: ['Marks']
      },
      yAxis: {
        type: 'value',
        max: this.performanceData.questionsMarks.totalPossible
      },
      series: [
        {
          name: 'Scored',
          type: 'bar',
          stack: 'total',
          data: [this.performanceData.questionsMarks.totalScored],

          itemStyle: {
            color: colors.infoLight
          }
        },
        {
          name: 'Remaining',
          type: 'bar',
          stack: 'total',
          data: [remainingMarks],
          itemStyle: {
            color: colors.bg2
          }
        }
      ]
    }
  }

  private setQuestionsStatusesCountPieChart() {
    const colors = this.themeConfig.variables
    const echarts: any = this.themeConfig.variables.echarts

    this.questionsStatusesCountChartOptions = {
      backgroundColor: echarts.bg,
      color: [colors.successLight, colors.dangerLight, colors.primaryLight, colors.infoLight],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Correct', 'Incorrect', 'Omitted', 'Marked'],
        textStyle: {
          color: echarts.textColor
        }
      },
      series: [
        {
          name: 'Questions',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {value: this.performanceData.questionsStatusesCount.correct, name: 'Correct'},
            {value: this.performanceData.questionsStatusesCount.incorrect, name: 'Incorrect'},
            {value: this.performanceData.questionsStatusesCount.omitted, name: 'Omitted'},
            {value: this.performanceData.questionsStatusesCount.marked, name: 'Marked'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor
            }
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor
              }
            }
          }
        }
      ]
    }
  }

  private async getPerformanceData() {
    this.performanceData = await firstValueFrom(this.tutuorService.getPerformanceReport())
    this.setQuestionsCountPieChart()
    this.setQuestionsStatusesCountPieChart()
    this.setPracticeTestsCountPieChart()
    this.setQuestionsMarksBarChart()
    this.prepareCategoriesTreeData()
  }

  // Method to calculate percentage
  private calculatePercentage(marks: number, total: number): string {
    if (total === 0 || marks === 0) return '0%' // Prevent division by zero
    return ((marks / total) * 100).toFixed(2) + '%'
  }

  private calculateProgress(used: number, total: number): number {
    if (total === 0 || used === 0) return 0
    return (used / total) * 100
  }

  private prepareCategoriesTreeData() {
    this.performanceData.categories.forEach(category => {
      const categoryNode: TreeNode<FSEntry> = {
        data: {
          name: category.name,
          progress: this.calculateProgress(category.questionsCount.used, category.questionsCount.total),
          usage: `${category.questionsCount.used}/${category.questionsCount.total}`,
          marks: `${category.questionsMarks.totalScored}/${
            category.questionsMarks.totalPossible
          } (${this.calculatePercentage(category.questionsMarks.totalScored, category.questionsMarks.totalPossible)})`,
          correct: `${category.questionsStatuses.correct} (${this.calculatePercentage(
            category.questionsStatuses.correct,
            category.questionsCount.used
          )})`,
          incorrect: `${category.questionsStatuses.incorrect} (${this.calculatePercentage(
            category.questionsStatuses.incorrect,
            category.questionsCount.used
          )})`,
          omitted: `${category.questionsStatuses.omitted} (${this.calculatePercentage(
            category.questionsStatuses.omitted,
            category.questionsCount.used
          )})`,
          marked: `${category.questionsStatuses.marked} (${this.calculatePercentage(
            category.questionsStatuses.marked,
            category.questionsCount.used
          )})`
        },
        children: []
      }

      category.subcategories.forEach(subcategory => {
        categoryNode.children.push({
          data: {
            isSubcategory: true,
            progress: this.calculateProgress(subcategory.questionsCount.used, subcategory.questionsCount.total),
            name: subcategory.name,
            usage: `${subcategory.questionsCount.used}/${subcategory.questionsCount.total}`,
            marks: `${subcategory.questionsMarks.totalScored}/${
              subcategory.questionsMarks.totalPossible
            } (${this.calculatePercentage(
              subcategory.questionsMarks.totalScored,
              subcategory.questionsMarks.totalPossible
            )})`,
            correct: `${subcategory.questionsStatuses.correct} (${this.calculatePercentage(
              subcategory.questionsStatuses.correct,
              subcategory.questionsCount.used
            )})`,
            incorrect: `${subcategory.questionsStatuses.incorrect} (${this.calculatePercentage(
              subcategory.questionsStatuses.incorrect,
              subcategory.questionsCount.used
            )})`,
            omitted: `${subcategory.questionsStatuses.omitted} (${this.calculatePercentage(
              subcategory.questionsStatuses.omitted,
              subcategory.questionsCount.used
            )})`,
            marked: `${subcategory.questionsStatuses.marked} (${this.calculatePercentage(
              subcategory.questionsStatuses.marked,
              subcategory.questionsCount.used
            )})`
          },
          children: []
        })
      })

      this.categoriesTreeData.push(categoryNode)
    })

    this.dataSource = this.dataSourceBuilder.create(this.categoriesTreeData)
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column
    this.sortDirection = sortRequest.direction
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection
    }
    return NbSortDirection.NONE
  }

  getCellValue(columnValue: string | number, columnName: string): string | number {
    return columnValue || '-'
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400
    const nextColumnStep = 100
    return minWithForMultipleColumns + nextColumnStep * index
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: ` <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="!isSubcategory"> </nb-tree-grid-row-toggle> `
})
export class FsIconComponent {
  @Input() isSubcategory: boolean
  @Input() expanded: boolean
}
