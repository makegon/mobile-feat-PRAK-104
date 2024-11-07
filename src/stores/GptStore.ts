import rootStore, {TRootStore} from './RootStore.ts'
import {makeAutoObservable, runInAction} from 'mobx'
import {GptModelsType} from '../common/types/GptModelsType.ts'
import {network} from '../RootNavigation.tsx'
import {IndexPath} from '@ui-kitten/components'

const defaultGptModel: GptModelsType = {
  id: 1,
  name: 'gpt-4o',
  is_selected: true,
}

export class GptStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  gptModels: GptModelsType[] | undefined = undefined
  selectedModel: GptModelsType | undefined = defaultGptModel
  isGetGptModelsInProcess: boolean = false
  isSelectGptModelsInProcess: boolean = false

  clearData = () => {
    this.gptModels = undefined
    this.selectedModel = defaultGptModel
    this.isGetGptModelsInProcess = false
    this.isSelectGptModelsInProcess = false
  }

  setSelectedModel = async (index: IndexPath) => {
    if (this.gptModels) {
      runInAction(() => {
        this.gptModels = this.gptModels.map((model, modelIndex) => {
          if (model.is_selected && modelIndex !== index.row) {
            model.is_selected = false
          } else if (!model.is_selected && modelIndex === index.row) {
            model.is_selected = true
          }
          return model
        })
        this.selectedModel = {
          ...this.gptModels[index.row ?? 0],
          is_selected: true,
        }
      })
    } else {
      runInAction(() => {
        this.selectedModel = defaultGptModel
      })
    }

    if (this.isSelectGptModelsInProcess || !this.gptModels) {
      return
    }

    try {
      this.setIsSelectGptModels(true)
      const {data} = await network.post('/user', {
        model_id: this.gptModels[index.row ?? 0].id,
      })

      await this.getGptModels()
    } catch (e) {
      console.log(`select gpt model error => ${e}`)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.setIsSelectGptModels(false)
    }
  }

  getGptModels = async () => {
    if (this.isGetGptModelsInProcess) {
      return
    }
    try {
      this.setIsGetGptModelsInProcess(true)
      const {data} = await network.get('/gpt/models')
      this.setGptModels(data)
      this.selectedModel = rootStore.userStore.currentUser?.selected_model_id ? this.gptModels?.find(model => model.id === rootStore.userStore.currentUser?.selected_model_id) : this.gptModels?.[0]
    } catch (e) {
      console.log(e)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.setIsGetGptModelsInProcess(false)
    }
  }

  setGptModels = (models: GptModelsType[]) => {
    this.gptModels = models
  }

  setIsGetGptModelsInProcess = (value: boolean) => {
    this.isGetGptModelsInProcess = value
  }

  setIsSelectGptModels = (value: boolean) => {
    this.isSelectGptModelsInProcess = value
  }
}

export type TGptStore = GptStore
