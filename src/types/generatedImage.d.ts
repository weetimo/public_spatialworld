import { User } from './user'

export interface GeneratedImage {
  id: string
  critique: string
  engagementId: string
  imageUrl: string
  originalPrompt: string
  voters: string[] // userIds
  upscaledPrompt: string
  userId: string
  user: User
  createdAt: string
}
