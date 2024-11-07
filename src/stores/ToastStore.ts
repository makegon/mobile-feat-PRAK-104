import {TRootStore} from './RootStore.ts'
import {makeAutoObservable} from 'mobx'
import {ToastMessageType} from '../common/types/ToastMessageType.ts'

const toastMessageDefaultValue: ToastMessageType = {message: '', type: ''}
export const TOAST_DELAY = 2000
const TIME_ACROSS_TOASTS = 500

export class ToastStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  toastMessage: ToastMessageType = toastMessageDefaultValue
  currentToastQueueProcess: NodeJS.Timeout | null = null
  toastQueue: ToastMessageType[] = []

  clearData = () => {
    this.toastMessage = toastMessageDefaultValue
    this.currentToastQueueProcess = null
    this.toastQueue = []
  }

  clearToasts = () => {
    !!this.currentToastQueueProcess && clearTimeout(this.currentToastQueueProcess)
    this.currentToastQueueProcess = null
    this.toastQueue = []
    this.toastMessage = toastMessageDefaultValue
  }

  displayToast = () => {
    if (this.toastQueue.length > 0) {
      this.toastMessage = this.toastQueue.shift() ?? toastMessageDefaultValue
      this.currentToastQueueProcess = setTimeout(() => {
        this.toastMessage = toastMessageDefaultValue
        setTimeout(() => {
          this.toastQueue.length > 0 ? this.displayToast() : this.clearToasts()
        }, TIME_ACROSS_TOASTS)
      }, TOAST_DELAY)
    }
  }

  addToastInQueue = (message: ToastMessageType) => {
    if (this.toastQueue.length === 1) {
      this.toastQueue.shift()
    }

    this.toastQueue.push(message)

    !this.currentToastQueueProcess && this.displayToast()
  }

  setToast = (message: ToastMessageType) => {
    if (message.message === '') {
      this.clearToasts()
    } else {
      this.addToastInQueue(message)
    }
  }
}

export type TToastStore = ToastStore
