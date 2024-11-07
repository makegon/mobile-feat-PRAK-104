import {makeAutoObservable} from 'mobx'
import {TRootStore} from './RootStore.ts'
import {PasswordValidateType, UserType, ValidatorType} from '../common/types/UserType.ts'
import {network} from '../RootNavigation.tsx'
import {removeTemporaryPassword} from '../utils/secureStorage.ts'
import {checkIsValidPassword, defaultIsValidPassword} from '../utils/helper.ts'
import {ChangePasswordTypes} from '../common/enums.ts'

export class UserStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  currentUser: UserType | undefined = undefined
  oldPassword: string | undefined = undefined
  password: string | undefined = undefined
  passwordRepeat: string | undefined = undefined
  temporaryPassword: string | null | undefined = undefined
  isChangePasswordInProcess = false
  isValidPassword: PasswordValidateType = defaultIsValidPassword
  isValidOldPassword: PasswordValidateType = defaultIsValidPassword
  isValidPasswordRepeat: PasswordValidateType = defaultIsValidPassword

  setIsValidPassword = (value: PasswordValidateType) => {
    this.isValidPassword = value
  }

  setIsValidOldPassword = (value: PasswordValidateType) => {
    this.isValidOldPassword = value
  }

  setIsValidPasswordRepeat = (value: PasswordValidateType) => {
    this.isValidPasswordRepeat = value
  }

  setPassword = (text: string | undefined) => {
    this.password = text
  }

  setOldPassword = (text: string | undefined) => {
    this.oldPassword = text
  }

  setPasswordRepeat = (text: string | undefined) => {
    this.passwordRepeat = text
  }

  setIsChangePasswordInProcess = (value: boolean) => {
    this.isChangePasswordInProcess = value
  }

  setCurrentUser = (data: UserType | undefined) => {
    this.currentUser = data
  }

  setTemporaryPassword = (value: string | null | undefined) => {
    this.temporaryPassword = value
  }

  clearValidation = () => {
    this.setIsValidPassword(defaultIsValidPassword)
    this.setIsValidOldPassword(defaultIsValidPassword)
    this.setIsValidPasswordRepeat(defaultIsValidPassword)
  }

  clearPasswords = () => {
    this.setPassword(undefined)
    this.setOldPassword(undefined)
    this.setPasswordRepeat(undefined)
  }

  get validateNewPasswords() {
    return this.isValidPassword.isValid && this.isValidPasswordRepeat.isValid && this.password === this.passwordRepeat
  }

  get validateAllPassword() {
    console.log('validateAllPassword', this.isValidPassword, this.isValidPasswordRepeat, this.isValidOldPassword)
    return this.isValidPassword.isValid && this.isValidPasswordRepeat.isValid && this.isValidOldPassword.isValid
  }

  validatePassword = (text: string, type: ChangePasswordTypes) => {
    const trimmedPassword = text.trim()
    const {isValid, reason} = checkIsValidPassword(trimmedPassword)

    const validators: Record<ChangePasswordTypes, ValidatorType> = {
      [ChangePasswordTypes.OLD]: {
        setIsValid: this.setIsValidOldPassword,
        setPassword: this.setOldPassword,
      },
      [ChangePasswordTypes.NEW]: {
        setIsValid: this.setIsValidPassword,
        setPassword: this.setPassword,
      },
      [ChangePasswordTypes.NEW_REPEAT]: {
        setIsValid: this.setIsValidPasswordRepeat,
        setPassword: this.setPasswordRepeat,
      },
    }
    const {setIsValid, setPassword} = validators[type]

    setIsValid({isValid, reason})

    setPassword(trimmedPassword)
  }

  changePassword = async () => {
    try {
      this.setIsChangePasswordInProcess(true)
      const {data} = await network.post('/auth/change-password', {
        oldPassword: this.temporaryPassword ? this.temporaryPassword : this.oldPassword,
        newPassword: this.password,
      })
      this.setOldPassword(undefined)
      this.setPassword(undefined)
      this.setTemporaryPassword(undefined)
      await removeTemporaryPassword()
      await this.getCurrentUser()
    } catch (e) {
      console.log(`e ${e}`)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.clearValidation()
      this.clearPasswords()
      this.setIsChangePasswordInProcess(false)
    }
  }

  getCurrentUser = async () => {
    try {
      //this.setIsGetCurrentUserInProcess(true)
      const {data} = await network.get<UserType>('/user')
      this.setCurrentUser(data)
    } catch (e) {
      console.log(`e`, e)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      //this.setIsGetCurrentUserInProcess(false)
    }
  }

  clearData = () => {
    this.currentUser = undefined
    this.temporaryPassword = undefined
    this.clearValidation()
    this.clearPasswords()
    this.setIsChangePasswordInProcess(false)
  }
}

export type TUserStore = UserStore
