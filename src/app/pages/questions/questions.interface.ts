/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Category, SubCategory} from '../categories/categories.interface'
import {CaseStudy} from '../case-studies/case-studies.interface'

interface OptionsArrayWithIsCorrect {
  value: string
  isCorrect: boolean
}

interface OptionsImageArrayWithIsCorrect {
  selectedImage?: any
  previewUrl?: string | ArrayBuffer | null
  imageUrl: string
  isCorrect: boolean
}

interface OptionsArrayWithSequence {
  value: string
  sequence: number
}

export interface Question {
  _id?: string
  id?: string
  title?: string
  category?: string | Category
  subCategory?: string | SubCategory
  type?: EQuestionType
  explanation?: string
  marks?: number
  status?: string
  caseStudy?: string | CaseStudy

  isAttempted?: boolean
  marksObtained?: number
}

export interface MultipleChoiceQuestion extends Question {
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  correctOption?: number
  /**
   * Store the user selected option index
   */
  userSelectedAnswer?: number
  /**
   * Indicate if the user has attempted the question
   */
  isAttempted?: boolean
  marksObtained?: number

  showAnswer?: boolean
}

export interface GraphicInQuestion extends Question {
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  imageUrl: string
  correctOption: number
}

export interface GraphicInAnswer extends Question {
  optionsArray: OptionsImageArrayWithIsCorrect[]
  optionsCount: number
  correctOption: number
}

export interface MultipleResponseQuestion extends Question {
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
}

export interface ChartExhibitQuestion extends Question {
  chartExhibit: string
  chartExhibitTitle: string
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  correctOption: number
}

export interface FillInTheBlanksQuestion extends Question {
  fillInTheBlankAnswer: string
}

export interface MultipleResponseNQuestion extends Question {
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  selectedOptions: number
}

export interface AudioQuestion extends Question {
  audioUrl: string
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  correctOption: number
}

export interface VideoQuestion extends Question {
  videoUrl: string
  optionsArray: OptionsArrayWithIsCorrect[]
  optionsCount: number
  correctOption: number
}

export interface MatrixMultipleChoiceQuestion extends Question {
  optionsArray: {
    value: string
    options: {isCorrect: boolean}[]
    correctOption: number
  }[]
  rowsCount: number
  columnsCount: number
  actionTitle: string
  effective: string
  ineffective: string
  unrelated: string
}

export interface MatrixMultipleResponseQuestion extends Question {
  optionsArray: {
    value: string
    options: {isCorrect: boolean}[]
  }[]
  rowsCount: number
  columnsCount: number
  actionTitle: string
  columns: {value: string}[]
}

export interface DropDownTableQuestion extends Question {
  optionsArray: {
    value: string
    options: string[]
    correct: string
  }[]
  rowsCount: number
  heading1: string
  heading2: string
}
export interface HighlightTableQuestion extends Question {
  optionsArray: {
    title: string
    content: string
    allOptions: {
      value: string
      correct: boolean
    }[]
  }[]
  rowsCount: number
  heading1: string
  heading2: string
}
export interface DropDownClozeQuestion extends Question {
  content: string
  optionsArray: {
    value: string
    options: string[]
    correct: string
  }[]
  fillupsCount: number
}

export interface DropDownDyadsQuestion extends Question {
  content: string
  cause: {
    label: string
    options: string[]
    correct: string
  }
  effect: {
    label: string
    options: string[]
    correct: string
  }

  userSelectedAnswer?: {
    cause: string
    effect: string
  }
}

export interface DropDownTriadsQuestion extends Question {
  content: string
  cause: {
    label: string
    options: string[]
    correct: string
  }
  effect1: {
    label: string
    options: string[]
    correct: string
  }

  effect2: {
    label: string
    options: string[]
    correct: string
  }

  userSelectedAnswer?: {
    cause: string
    effect1: string
    effect2: string
  }
}

export interface DragDropClozeQuestion extends Question {
  content: string
  allOptions: string[]
  fillups: [
    {
      label: string
      value: string
    }
  ]
  fillupsCount: number
}

export interface DragDropDyadsQuestion extends Question {
  content: string
  allOptions: string[]

  cause: {
    label: string
    value: string
  }

  effect: {
    label: string
    value: string
  }

  userSelectedAnswer?: {
    cause: string
    effect: string
  }
}

export interface DragDropTriadsQuestion extends Question {
  content: string
  allOptions: string[]

  cause: {
    label: string
    value: string
  }

  effect1: {
    label: string
    value: string
  }

  effect2: {
    label: string
    value: string
  }

  userSelectedAnswer?: {
    cause: string
    effect1: string
    effect2: string
  }
}

export interface DragDropOrderedResponseQuestion extends Question {
  optionsArray: OptionsArrayWithSequence[]
  optionsCount: number
}

export enum EQuestionType {
  AUDIO = 'AUDIO',
  BOWTIE = 'BOWTIE',
  CHART_EXHIBIT = 'CHART_EXHIBIT',
  DRAG_DROP_DYADS = 'DRAG_DROP_DYADS',
  DRAG_DROP_TRIADS = 'DRAG_DROP_TRIADS',
  DRAG_DROP_CLOZE = 'DRAG_DROP_CLOZE',
  DRAG_DROP_ORDERED_RESPONSE = 'DRAG_DROP_ORDERED_RESPONSE',
  DROP_DOWN_DYADS = 'DROP_DOWN_DYADS',
  DROP_DOWN_TRIADS = 'DROP_DOWN_TRIADS',
  DROP_DOWN_CLOZE = 'DROP_DOWN_CLOZE',
  DROP_DOWN_TABLE = 'DROP_DOWN_TABLE',
  FILL_IN_THE_BLANKS = 'FILL_IN_THE_BLANKS',
  GRAPHIC_IN_ANSWER = 'GRAPHIC_IN_ANSWER',
  GRAPHIC_IN_QUESTION = 'GRAPHIC_IN_QUESTION',
  HIGHLIGHT_TABLE = 'HIGHLIGHT_TABLE',
  HIGHLIGHT_TEXT = 'HIGHLIGHT_TEXT',
  MATRIX_MULTIPLE_CHOICE = 'MATRIX_MULTIPLE_CHOICE',
  MATRIX_MULTIPLE_RESPONSE = 'MATRIX_MULTIPLE_RESPONSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_RESPONSE = 'MULTIPLE_RESPONSE',
  MULTIPLE_RESPONSE_GROUPING = 'MULTIPLE_RESPONSE_GROUPING',
  MULTIPLE_RESPONSE_N = 'MULTIPLE_RESPONSE_N',
  VIDEO = 'VIDEO'
}

export interface IQuestionTypeWithTitle {
  value: EQuestionType
  title: string
}

export const QuestionTypesListWithTitle: IQuestionTypeWithTitle[] = [
  {value: EQuestionType.AUDIO, title: 'Audio'},
  {value: EQuestionType.BOWTIE, title: 'Bowtie'},
  {value: EQuestionType.CHART_EXHIBIT, title: 'Chart Exhibit'},
  {value: EQuestionType.DRAG_DROP_CLOZE, title: 'Drag Drop Cloze'},
  {value: EQuestionType.DRAG_DROP_DYADS, title: 'Drag Drop Dyads (Rational)'},
  {value: EQuestionType.DRAG_DROP_ORDERED_RESPONSE, title: 'Drag Drop Ordered Response'},
  {value: EQuestionType.DRAG_DROP_TRIADS, title: 'Drag Drop Triads (Rational)'},
  {value: EQuestionType.DROP_DOWN_CLOZE, title: 'Drop Down Cloze'},
  {value: EQuestionType.DROP_DOWN_DYADS, title: 'Drop Down Dyads (Rational)'},
  {value: EQuestionType.DROP_DOWN_TABLE, title: 'Drop Down Table'},
  {value: EQuestionType.DROP_DOWN_TRIADS, title: 'Drop Down Triads (Rational)'},
  {value: EQuestionType.FILL_IN_THE_BLANKS, title: 'Fill in the blanks'},
  {value: EQuestionType.GRAPHIC_IN_ANSWER, title: 'Graphic in Answer'},
  {value: EQuestionType.GRAPHIC_IN_QUESTION, title: 'Graphic in Question'},
  {value: EQuestionType.HIGHLIGHT_TABLE, title: 'Highlight Table'},
  {value: EQuestionType.HIGHLIGHT_TEXT, title: 'Highlight Text'},
  {value: EQuestionType.MATRIX_MULTIPLE_CHOICE, title: 'Matrix Multiple Choice'},
  {value: EQuestionType.MATRIX_MULTIPLE_RESPONSE, title: 'Matrix Multiple Response'},
  {value: EQuestionType.MULTIPLE_CHOICE, title: 'Multiple Choice'},
  {value: EQuestionType.MULTIPLE_RESPONSE, title: 'Multiple Response'},
  {value: EQuestionType.MULTIPLE_RESPONSE_GROUPING, title: 'Multiple Response Grouping'},
  {value: EQuestionType.MULTIPLE_RESPONSE_N, title: 'Multiple Response N'},
  {value: EQuestionType.VIDEO, title: 'Video'}
]

export const QuestionScoringRules = [
  {
    label: '0/1 Scoring',
    value: '0/1',
    description: `You'll gain 1 point for each right answer and no points for a wrong one.`
  },
  {
    label: '+/- Scoring',
    value: '+/-',
    description:
      'You will receive 1 point for every accurate answer, lose 1 point for every incorrect answer, and your score cannot go below zero.'
  },
  {
    label: 'Rational Scoring',
    value: 'RATIONAL_SCORING',
    description: `Earn points when both responses in the pair are correct`
  }
]

export abstract class QuestionData {
  abstract get gridDataSource(): DataSource
  abstract list(pageNumber: number, pageSize: number): Observable<any[]>
  abstract get(id: string): Observable<any>
  abstract update(question: any): Observable<any>
  abstract create(question: any): Observable<any>
  abstract delete(id: string): Observable<boolean>
}
