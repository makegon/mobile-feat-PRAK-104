import {makeAutoObservable} from 'mobx'
import {TRootStore} from './RootStore.ts'

export class TextStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }
}

export type TTextStore = TextStore
