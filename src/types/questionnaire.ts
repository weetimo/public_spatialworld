import { QuestionnaireType } from '../enums'

export interface Questionnaire {
  id?: string
  questions?: Question[]
}

export interface Question {
  id?: string
  question?: string
  choices?: string[]
  questionnaireId?: string
  type?: QuestionnaireType
}

export interface Answer {
  id?: string
  answer?: string[]
  questionId?: string
  questionnaireId?: string
}
