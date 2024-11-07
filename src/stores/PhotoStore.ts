import {TRootStore} from './RootStore.ts'
import {makeAutoObservable, runInAction} from 'mobx'
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker'

export class PhotoStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  selectedPhoto: Asset | undefined = undefined
  didCancel: boolean | undefined = false

  clearData = () => {
    this.selectedPhoto = undefined
  }

  takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
        includeBase64: true,
        includeExtra: true,
      })
      runInAction(() => {
        this.didCancel = result.didCancel
      })
      console.log('Photo store::::', result.didCancel)
      if (!result.didCancel && result.assets) {
        runInAction(() => {
          this.selectedPhoto = result.assets ? result.assets[0] : undefined
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  chooseFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        includeExtra: true,
        selectionLimit: 1,
      })

      runInAction(() => {
        this.didCancel = result.didCancel
      })

      if (!result.didCancel && result.assets) {
        this.selectedPhoto = result.assets[0]
      }
    } catch (e) {
      console.log(e)
    }
  }

  requestPermission = async () => {
    try {
    } catch (e) {
      console.log(e)
    }
  }

  clear = () => {
    this.selectedPhoto = undefined
  }
}

export type TPhotoStore = PhotoStore
