import {TextStore, TTextStore} from './TextStore.ts'
import {PhotoStore, TPhotoStore} from './PhotoStore.ts'
import {ChatStore, TChatStore} from './ChatStore.ts'
import {PromptStore, TPromptStore} from './PromptStore.ts'
import RNBootSplash from 'react-native-bootsplash'
import {TUserStore, UserStore} from './UserStore.ts'
import {deleteAllStorageData, getTemporaryPassword, getUserDataForAuth} from '../utils/secureStorage.ts'
import {ToastStore, TToastStore} from './ToastStore.ts'
import {PremiumStore, TPremiumStore} from './PremiumStore.ts'
import {AuthStore, TAuthStore} from './AuthStore.ts'
import {GptStore, TGptStore} from './GptStore.ts'

class RootStore {
  public authStore: TAuthStore
  public textStore: TTextStore
  public chatStore: TChatStore
  public photoStore: TPhotoStore
  public promptStore: TPromptStore
  public userStore: TUserStore
  public toastStore: TToastStore
  public premiumStore: TPremiumStore
  public gptStore: TGptStore

  constructor() {
    this.authStore = new AuthStore(this)
    this.textStore = new TextStore(this)
    this.chatStore = new ChatStore(this)
    this.photoStore = new PhotoStore(this)
    this.promptStore = new PromptStore(this)
    this.userStore = new UserStore(this)
    this.toastStore = new ToastStore(this)
    this.premiumStore = new PremiumStore(this)
    this.gptStore = new GptStore(this)
  }

  isShowLoader = false

  init = async () => {
    const isUserAuth = await getUserDataForAuth()
    this.authStore.setIsUserAuth(isUserAuth.access_token !== null)
    this.userStore.setTemporaryPassword(await getTemporaryPassword())
    setTimeout(async () => {
      await RNBootSplash.hide({fade: true})
    }, 500)
  }

  setIsShowLoader = (value: boolean) => {
    this.isShowLoader = value
  }

  async clearData() {
    this.authStore.clearData()
    await this.chatStore.clearChatData()
    this.photoStore.clearData()
    this.promptStore.clearData()
    this.userStore.clearData()
    this.toastStore.clearData()
    this.gptStore.clearData()
    // await deleteAllStorageData()
  }
}

export default new RootStore()

export type TRootStore = RootStore
