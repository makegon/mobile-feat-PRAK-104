import {TRootStore} from './RootStore.ts'
import {makeAutoObservable} from 'mobx'
import {PromptType} from '../common/types/PromptType.ts'
import {network} from '../RootNavigation.tsx'
import {CategoryType} from '../common/types/CategoryType.ts'

const testPrompt: CategoryType = {
  id: 1,
  name: 'test',
  icon: 'smiling-face-outline',
  order_index: 1,
  prompts: [
    {
      id: 1,
      name: 'Тестовый title',
      description: 'Тестовое описание',
      icon: 'smiling-face-outline',
      prompt: 'Тестовый prompt',
    },
    {
      id: 2,
      name: 'Тестовый title1',
      description: 'Тестовое описание',
      prompt: 'Тестовый prompt',
    },
    {
      id: 3,
      name: 'Тестовый title2',
      description: 'Тестовое описание',
      prompt: 'Тестовый prompt',
    },
  ],
}

export class PromptStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  categoriesWithPromptArray: CategoryType[] | undefined = [testPrompt]
  isLoadPrompts = true

  clearData = () => {
    this.categoriesWithPromptArray = [testPrompt]
    this.isLoadPrompts = true
  }

  setLoadPrompts = (value: boolean) => {
    this.isLoadPrompts = value
  }

  setPromptArray = (data: CategoryType[] | undefined) => {
    this.categoriesWithPromptArray = data ?? [testPrompt]
  }

  clearPromptArray = () => {
    this.categoriesWithPromptArray = undefined
  }

  get allPrompts() {
    return (
      this.categoriesWithPromptArray?.reduce((acc: PromptType[], cur: CategoryType) => [...acc, ...cur.prompts.map<PromptType>(item => ({...item, categoryName: cur.name}))], [] as PromptType[]) ?? []
    )
  }

  getPrompt = async () => {
    try {
      const {data} = await network.get<CategoryType[]>('gpt/categories')
      this.setPromptArray(data)
    } catch (e) {
      console.log(e)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.setLoadPrompts(false)
    }
  }
}

export type TPromptStore = PromptStore
