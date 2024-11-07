import {PromptType} from './PromptType.ts'

export type CategoryType = {
  id: number
  name: string
  icon: string
  order_index: number
  prompts: PromptType[]
}
