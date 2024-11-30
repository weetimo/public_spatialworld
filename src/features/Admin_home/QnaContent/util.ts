const aggregateMultipleChoice = (users: any[], questions: any[]): any[] => {
  const multipleChoiceData: any[] = []

  const questionMap: Record<string, { question: string; choices: string[] }> = {}
  questions.forEach((question: any) => {
    if (question.type === 'MULTI_ANSWERS') {
      questionMap[question.id] = {
        question: question.question,
        choices: question.choices || []
      }
    }
  })

  const answerCounts: Record<string, Record<string, number>> = {}
  Object.entries(questionMap).forEach(([questionId, details]) => {
    answerCounts[questionId] = details.choices.reduce(
      (acc: Record<string, number>, choice: string) => {
        acc[choice] = 0
        return acc
      },
      {}
    )
  })

  users?.forEach((user) => {
    user.preferences?.answers?.forEach((answer: any) => {
      const questionId = answer.questionId

      if (questionMap[questionId]) {
        answer.answer.forEach((response: string) => {
          if (answerCounts[questionId][response] !== undefined) {
            answerCounts[questionId][response] += 1
          }
        })
      }
    })
  })

  Object.entries(answerCounts).forEach(([questionId, responses]) => {
    const { question } = questionMap[questionId]
    multipleChoiceData.push({
      question,
      responses: Object.entries(responses).map(([answer, count]) => ({
        answer,
        count
      }))
    })
  })

  return multipleChoiceData
}

const aggregateOpenEnded = (users: any[], questions: any): any[] => {
  const openEndedData: any[] = []

  const questionMap: Record<string, string> = {}
  questions.forEach((question: any) => {
    if (question.type === 'FREE_RESPONSE') {
      questionMap[question.id] = question.question
    }
  })

  const randomTopics = ['Topic A', 'Topic B', 'Topic C']

  const answersByQuestion: Record<string, string[]> = {}
  users?.forEach((user) => {
    user.preferences?.answers?.forEach((answer: any) => {
      const questionId = answer.questionId
      if (questionMap[questionId]) {
        if (!answersByQuestion[questionId]) {
          answersByQuestion[questionId] = []
        }
        answersByQuestion[questionId].push(...answer.answer)
      }
    })
  })

  // TODO: Fix this randomizing logic
  Object.entries(answersByQuestion).forEach(([questionId, responses]) => {
    const categories = randomTopics.map((topic) => ({
      topic,
      responses: responses.splice(0, Math.ceil(responses.length / randomTopics.length)),
    }))
    openEndedData.push({
      question: questionMap[questionId],
      categories,
    })
  })

  return openEndedData
}

export const getTopicsForQuestion = (question: any): string[] => {
  const topics = new Set<string>()
  question.categories.forEach((category) => {
    topics.add(category.topic)
  })
  return ['All', ...Array.from(topics)]
}

export const generateData = (users: any[], questions: any): any => {
  return {
    multipleChoice: aggregateMultipleChoice(users, questions),
    openEnded: aggregateOpenEnded(users, questions)
  }
}
