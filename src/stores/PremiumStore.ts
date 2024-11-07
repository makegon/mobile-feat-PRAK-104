import {TRootStore} from './RootStore.ts'
import {makeAutoObservable} from 'mobx'

export class PremiumStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }
}

export type TPremiumStore = PremiumStore
