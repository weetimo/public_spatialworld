import React, { useEffect, useState, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Typography, Box, Button } from '@mui/material'
import { generateData, getTopicsForQuestion } from './util'
import { useDatabase } from '../../../hooks'

// Define types for the data structure
interface Response {
  answer: string
  count: number
}

interface Category {
  topic: string
  responses: string[]
}

interface MultipleChoiceQuestion {
  question: string
  responses: Response[]
}

interface OpenEndedQuestion {
  question: string
  categories: Category[]
}

interface ColorScheme {
  bg: string
  border: string
}

const QnaContent: React.FC<{ engagementId: string }> = ({ engagementId }) => {
  const { readData } = useDatabase()

  // State for storing selected filters for each question
  const [selectedFilters, setSelectedFilters] = useState<
    Record<number, string>
  >({})
  const [multipleChoiceData, setMultipleChoiceData] = useState<any[]>([])
  const [openEndedData, setOpenEndedData] = useState<any[]>([])

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions = await readData(`questionnaires/${engagementId}/questions`)
        const users = await readData('users')
        const usersArray = Object.entries(users).map(([id, user]) => ({ id, ...user })).filter(user => user.preferences?.questionnaireId === engagementId)

        if (!questions || !users) return

        const { multipleChoice, openEnded } = generateData(usersArray, questions)
        setMultipleChoiceData(multipleChoice)
        setOpenEndedData(openEnded)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [engagementId, stableReadData])
  
  // Get color for a topic
  const getTopicColor = (topic: string, topics: string[]): ColorScheme => {
    const topicIndex = topics.indexOf(topic)

    const colorPalette: ColorScheme[] = [
      { bg: '#E5F6FD', border: '#81D4FA' }, // Light Blue
      { bg: '#FFF4E5', border: '#FFB74D' }, // Light Orange
      { bg: '#E8F5E9', border: '#81C784' }, // Light Green
      { bg: '#F3E5F5', border: '#BA68C8' }, // Light Purple
      { bg: '#E3F2FD', border: '#64B5F6' }, // Another Blue
      { bg: '#FBE9E7', border: '#FF8A65' }, // Light Red
      { bg: '#F5F5F5', border: '#9E9E9E' }, // Light Grey
      { bg: '#E8EAF6', border: '#7986CB' }, // Light Indigo
      { bg: '#F3E5F5', border: '#AB47BC' }, // Light Purple
      { bg: '#E0F7FA', border: '#4DD0E1' } // Light Cyan
    ]

    if (topic === 'All' || topicIndex === -1) {
      return { bg: '#F5F5F5', border: '#E0E0E0' }
    }

    return colorPalette[(topicIndex - 1) % colorPalette.length]
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Title and Subtitle Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: {
              xs: '1.5rem',
              md: '2rem'
            },
            fontWeight: 700,
            color: 'text.primary',
            marginBottom: 1
          }}
        >
          Community Survey Responses
        </Typography>
        <Typography
          align='justify'
          sx={{
            color: 'text.secondary',
            fontSize: {
              xs: '0.875rem',
              md: '1rem'
            },
            maxWidth: '60rem'
          }}
        >
          Provides an overview of responses from participants of the engagement
          session.
        </Typography>
      </Box>
      {/* Multiple Choice Responses */}
      {multipleChoiceData.map(
        (question: MultipleChoiceQuestion, index: number) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                mb: 3,
                fontSize: '1.25rem',
                color: '#1a1a1a'
              }}
            >
              {question.question}
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={question.responses}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.4} />
                  <XAxis
                    dataKey='answer'
                    angle={-0}
                    textAnchor='middle'
                    height={60}
                    tick={{ fill: '#4a5568' }}
                  />
                  <YAxis tick={{ fill: '#4a5568' }} />
                  <Tooltip />
                  <Bar dataKey='count' fill='#4f46e5' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )
      )}

      {/* Open Ended Responses */}
      {openEndedData.map(
        (openEndedQuestion: OpenEndedQuestion, questionIndex: number) => {
          const topics = getTopicsForQuestion(openEndedQuestion)
          const currentFilter = selectedFilters[questionIndex] || 'All'

          return (
            <Box key={questionIndex} sx={{ mb: 6 }}>
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 4,
                  fontSize: '1.25rem'
                }}
              >
                {openEndedQuestion.question}
              </Typography>

              {/* Filter Buttons for each question */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {topics.map((topic: string) => {
                  const topicColor = getTopicColor(topic, topics)
                  return (
                    <Button
                      key={topic}
                      variant='outlined'
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [questionIndex]: topic
                        }))
                      }
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        border: `1px solid ${topicColor.border}`,
                        backgroundColor:
                          currentFilter === topic
                            ? topicColor.bg
                            : 'transparent',
                        color: '#000',
                        '&:hover': {
                          backgroundColor: topicColor.bg,
                          border: `1px solid ${topicColor.border}`
                        }
                      }}
                    >
                      {topic}
                    </Button>
                  )
                })}
              </Box>

              {/* Response Cards Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 3
                }}
              >
                {openEndedQuestion.categories
                  .filter(
                    (category) =>
                      currentFilter === 'All' ||
                      category.topic === currentFilter
                  )
                  .map((category, categoryIndex) =>
                    category.responses.map((response, responseIndex) => {
                      const topicColor = getTopicColor(category.topic, topics)
                      return (
                        <Box
                          key={`${categoryIndex}-${responseIndex}`}
                          sx={{
                            backgroundColor: topicColor.bg,
                            borderRadius: '12px',
                            padding: '24px',
                            height: 'fit-content',
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            transition:
                              'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#666',
                              textTransform: 'uppercase'
                            }}
                          >
                            {category.topic}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.975rem',
                              color: '#334155',
                              lineHeight: 1.6
                            }}
                          >
                            {response}
                          </Typography>
                        </Box>
                      )
                    })
                  )}
              </Box>
            </Box>
          )
        }
      )}
    </Box>
  )
}

export default QnaContent
