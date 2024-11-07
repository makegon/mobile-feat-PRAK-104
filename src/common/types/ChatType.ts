import {MessageType} from './MessageType.ts'

export type ChatType = {
  id: number
  title: string
  user_id: number
  prompt_id: number
  created_at: Date
  updated_at: Date
  messages: MessageType[]
}

export type CurrentChatType = {
  current_page: number
  count_per_page: number
  messages: MessageType[]
}
