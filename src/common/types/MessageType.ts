import {ChatRoles} from '../enums.ts'

export type MessageType = {
  id: number | string
  role: ChatRoles
  images?: string[]
  message?: string
  created_at: Date
  updated_at: Date
}

export type GptResponseType = {
  chatId: number
  content: string
}
