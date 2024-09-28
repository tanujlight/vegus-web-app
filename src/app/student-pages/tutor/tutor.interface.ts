export enum PracticeTestStatusEnum {
  suspended = 'suspended',
  completed = 'completed',
  resumed = 'resumed',
  started = 'started'
}

export enum QuestionStatusEnum {
  correct = 'correct',
  incorrect = 'incorrect',
  marked = 'marked',
  omitted = 'omitted',
  unseen = 'unseen'
}

export enum QuestionModeEnum {
  unused = 'unused',
  incorrect = 'incorrect',
  marked = 'marked',
  omitted = 'omitted',
  correct = 'correct'
}

export interface IQuestionTypes {
  traditional: boolean
  nextGeneration: boolean
}

export interface IQuestionModes {
  unused: boolean
  correct: boolean
  incorrect: boolean
  marked: boolean
  omitted: boolean
}

export interface ICreatePracticeTestParams {
  questionTypes: IQuestionTypes
  questionModes: IQuestionModes
  categories: string[]
  subcategories: string[]
  noOfQuestions: number
}
