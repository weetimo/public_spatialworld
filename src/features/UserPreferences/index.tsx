import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, Button, TextField, LinearProgress } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { QuestionnaireType } from '../../enums'
import { Answer, Questionnaire } from '../../types'
import { useDatabase, useCurrentUser } from '../../hooks'

const UserPreferences = () => {
  const { id } = useParams()
  const engagementId = id

  const navigate = useNavigate()
  const { createData, readData } = useDatabase()
  const { currentUser } = useCurrentUser()

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [freeResponse, setFreeResponse] = useState('')

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const data = await readData(`questionnaires/${engagementId}`)
        setQuestionnaire(data);
        console.log('Questionnaire loaded successfully:', data)
      } catch (error) {
        console.error('Error fetching questionnaire:', error)
      }
    }

    fetchQuestionnaire()
  }, [stableReadData])

  const currentQuestion = questionnaire?.questions?.[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === (questionnaire?.questions?.length || 0) - 1

  const handleSelectChoice = (choice: string): void => {
    if (currentQuestion) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestion.id)
      if (existingAnswer) {
        existingAnswer.answer = existingAnswer.answer?.includes(choice)
          ? existingAnswer.answer.filter(ans => ans !== choice)
          : [...existingAnswer.answer, choice]
        setAnswers([...answers])
      } else {
        setAnswers([...answers, { questionId: currentQuestion.id, answer: [choice] }])
      }
    }
  }

  const handleFreeResponseChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFreeResponse(event.target.value)
  }

  const handleNext = (): void => {
    if (currentQuestion) {
      if (currentQuestion.type === QuestionnaireType.FREE_RESPONSE) {
        setAnswers([...answers, { questionId: currentQuestion.id, answer: [freeResponse] }])
        setFreeResponse('')
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = async (): Promise<void> => {
    const finalAnswers =
      currentQuestion?.type === QuestionnaireType.FREE_RESPONSE && freeResponse
        ? [...answers, { questionId: currentQuestion.id, answer: [freeResponse] }]
        : answers;

    await createData(`users/${currentUser?.id}/preferences`, {
      questionnaireId: questionnaire?.id,
      answers: finalAnswers,
    })
    console.log('Preferences saved successfully')

    navigate(`/meet-characters/${engagementId}`)
  }

  return (
    <Box sx={styles.container}>
      <LinearProgress
        variant="determinate"
        value={((currentQuestionIndex + 1) / (questionnaire?.questions?.length || 1)) * 100}
        sx={styles.progressBar}
      />

      <Typography variant="h5" sx={styles.questionText}>
        {currentQuestion?.question}
      </Typography>

      {currentQuestion?.type === QuestionnaireType.MULTI_ANSWERS && (
        <Box>
          {currentQuestion.choices?.map(choice => {
            const isSelected = answers.find(a => a.questionId === currentQuestion.id)?.answer?.includes(choice)
            return (
              <Button
                key={choice}
                variant="contained"
                onClick={() => handleSelectChoice(choice)}
                sx={{
                  ...styles.choiceButton,
                  ...(isSelected ? styles.choiceButtonSelected : {})
                }}
                endIcon={isSelected ? <CheckIcon sx={styles.checkIcon} /> : null}
              >
                {choice}
              </Button>
            )
          })}
        </Box>
      )}

      {currentQuestion?.type === QuestionnaireType.FREE_RESPONSE && (
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          placeholder="Share your thoughts here..."
          value={freeResponse}
          onChange={handleFreeResponseChange}
          sx={styles.textField}
          InputProps={{
            style: {
              backgroundColor: '#fff',
              borderRadius: '1rem',
            },
          }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={isLastQuestion ? handleSubmit : handleNext}
        fullWidth
        sx={styles.nextButton}
      >
        {isLastQuestion ? 'Submit' : 'Next'}
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '500px',
    margin: 'auto',
  },
  progressBar: {
    marginBottom: '1rem',
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    padding: '1rem',
  },
  choiceButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1.5rem',
    padding: '1.5rem',
    boxShadow: 'none',
    borderRadius: '12px',
    textAlign: 'left',
    fontSize: '1rem',
    textTransform: 'none',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#f0f4ff',
    },
  },
  choiceButtonSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#e0f0ff',
    color: '#007bff',
    boxShadow: 'none'
  },
  checkIcon: {
    color: '#007bff',
  },
  textField: {
    marginBottom: '1rem',
    borderRadius: '8px',
  },
  nextButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default UserPreferences
