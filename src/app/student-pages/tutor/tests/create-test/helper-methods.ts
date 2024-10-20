import {ICreatePracticeTestParams, QuestionModeEnum} from '../../tutor.interface'

/**
 * Distributes the number of questions into unused and used questions based on the proportion of available questions.
 * Ensures that the counts do not exceed the available counts.
 *
 * @param {number} noOfQuestions - The total number of questions to fetch.
 * @param {number} availableUnusedQuestionsCount - The total number of unused questions available.
 * @param {number} availableUsedQuestionsCount - The total number of used questions available.
 * @returns {Object} - An object containing the counts of unused and used questions to fetch.
 */
export const distributeQuestions = (input: {
  noOfQuestions: number
  availableUnusedQuestionsCount: number
  availableUsedQuestionsCount: number
}): {pickUnusedQuestionsCount: number; pickUsedQuestionsCount: number} => {
  const {noOfQuestions, availableUnusedQuestionsCount, availableUsedQuestionsCount} = input

  let pickUnusedQuestionsCount = 0
  let pickUsedQuestionsCount = 0

  // Calculate the total available questions
  const totalAvailableQuestions = availableUnusedQuestionsCount + availableUsedQuestionsCount

  // Calculate the proportions
  const unusedQuestionsProportion = availableUnusedQuestionsCount / totalAvailableQuestions

  // Calculate the fetch counts based on the proportions
  pickUnusedQuestionsCount = Math.round(noOfQuestions * unusedQuestionsProportion)
  pickUsedQuestionsCount = noOfQuestions - pickUnusedQuestionsCount

  // Ensure that the fetch counts do not exceed the available questions
  if (pickUnusedQuestionsCount > availableUnusedQuestionsCount) {
    pickUnusedQuestionsCount = availableUnusedQuestionsCount
    pickUsedQuestionsCount = noOfQuestions - pickUnusedQuestionsCount
  }

  if (pickUsedQuestionsCount > availableUsedQuestionsCount) {
    pickUsedQuestionsCount = availableUsedQuestionsCount
    pickUnusedQuestionsCount = noOfQuestions - pickUsedQuestionsCount
  }

  // Return the calculated counts
  return {
    pickUnusedQuestionsCount,
    pickUsedQuestionsCount
  }
}

/**
 * Calculates a random skip value ensuring it's non-negative and within bounds.
 *
 * @param {number} availableCount - Total count of available questions.
 * @param {number} requiredCount - Number of questions to fetch.
 * @returns {number} - Random skip value within bounds.
 */
export const calculateRandomSkip = (availableCount: number, requiredCount: number): number => {
  const maxSkip = Math.max(0, availableCount - requiredCount)
  return Math.floor(Math.random() * maxSkip)
}

export const prepareQuestionsForTest = (params: ICreatePracticeTestParams, allQuestions): string[] => {
  const {questionTypes, questionModes, categories, subcategories, noOfQuestions} = params

  let questions = []

  // filtered questions by questions type

  if (questionTypes.traditional && questionTypes.nextGeneration) {
    questions = allQuestions
  } else if (questionTypes.traditional && !questionTypes.nextGeneration) {
    questions = allQuestions.filter(i => !i.caseStudy)
  } else if (!questionTypes.traditional && questionTypes.nextGeneration) {
    questions = allQuestions.filter(i => i.caseStudy)
  }

  // filter questions by categories and subcategories
  if (categories.length > 0 && subcategories.length > 0) {
    questions = questions.filter(i => categories.includes(i.category) && subcategories.includes(i.subCategory))
  }

  // filter questions by question modes
  if (
    questionModes.unused &&
    questionModes.correct &&
    questionModes.incorrect &&
    questionModes.marked &&
    questionModes.omitted
  ) {
    questions = questions
  } else {
    const selectedModes = []
    if (questionModes.unused) selectedModes.push(QuestionModeEnum.unused)
    if (questionModes.correct) selectedModes.push(QuestionModeEnum.correct)
    if (questionModes.incorrect) selectedModes.push(QuestionModeEnum.incorrect)
    if (questionModes.marked) selectedModes.push(QuestionModeEnum.marked)
    if (questionModes.omitted) selectedModes.push(QuestionModeEnum.omitted)

    questions = questions.filter(i => selectedModes.includes(i.status))
  }

  let availableUnusedQuestionsCount = 0
  let availableUsedQuestionsCount = 0
  let availableUnusedQuestions = []
  let availableUsedQuestions = []

  if (questionModes.unused) {
    availableUnusedQuestions = questions.filter(i => i.status === QuestionModeEnum.unused)
    availableUnusedQuestionsCount = availableUnusedQuestions.length
  }

  if (questionModes.correct || questionModes.incorrect || questionModes.marked || questionModes.omitted) {
    availableUsedQuestions = questions.filter(i => i.status !== QuestionModeEnum.unused)
    availableUsedQuestionsCount = availableUsedQuestions.length
  }

  let pickedUnusedQuestions = []
  let pickedUsedQuestions = []

  const {pickUnusedQuestionsCount, pickUsedQuestionsCount} = distributeQuestions({
    noOfQuestions,
    availableUnusedQuestionsCount,
    availableUsedQuestionsCount
  })

  if (pickUnusedQuestionsCount > 0) {
    // Calculate a random skip value
    const randomSkip = calculateRandomSkip(availableUnusedQuestionsCount, pickUnusedQuestionsCount)
    pickedUnusedQuestions = availableUnusedQuestions.slice(randomSkip, randomSkip + pickUnusedQuestionsCount)
  }

  if (pickUsedQuestionsCount > 0) {
    // Calculate a random skip value
    const randomSkip = calculateRandomSkip(availableUsedQuestionsCount, pickUsedQuestionsCount)
    pickedUsedQuestions = availableUsedQuestions.slice(randomSkip, randomSkip + pickUsedQuestionsCount)
  }

  const pickedQuestions = [...pickedUnusedQuestions, ...pickedUsedQuestions]

  return pickedQuestions.map(i => i._id)
}
