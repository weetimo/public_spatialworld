import { useDatabase } from '../../../hooks'

export const stringToPastelColor = (string) => {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 80%)`
}

export const getQuestionsAndAnswers = async (engagementId: string, userAnswers: any[]) => {
  const { readData } = useDatabase()

  try {
    const questionnaire = await readData(`questionnaires/${engagementId}`)
    const questions = questionnaire?.questions || []

    const formattedData = userAnswers.map((answerObj: any) => {
      const question = questions.find((q: any) => q.id === answerObj.questionId)

      return {
        question: question?.question || 'Question not found',
        answers: answerObj.answer || [],
      }
    })

    return formattedData
  } catch (error) {
    console.error('Error fetching questions and answers:', error)
    return []
  }
}
