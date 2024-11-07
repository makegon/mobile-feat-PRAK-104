import {TRootStore} from './RootStore.ts'
import {makeAutoObservable} from 'mobx'
import {network} from '../RootNavigation.tsx'
import {PasswordValidateType, TokensType, UserType} from '../common/types/UserType.ts'
import {getRefreshToken, getTemporaryPassword, removeRefreshToken, removeTemporaryPassword, removeToken, setRefreshToken, setTemporaryPassword, setToken} from '../utils/secureStorage.ts'
import {cancelRequest} from '../utils/networkService.ts'
import {checkIsValidPassword, defaultIsValidPassword} from '../utils/helper.ts'

export class AuthStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  isUserAuth = false
  login: string | undefined = undefined
  password: string | undefined = undefined
  isLoginInProcess = false
  isRegisterInProcess = false
  isValidLogin = true
  isValidPassword: PasswordValidateType = defaultIsValidPassword
  isRefreshTokenInProcess = false

  clearData = () => {
    this.isUserAuth = false
    this.login = undefined
    this.password = undefined
    this.isLoginInProcess = false
    this.isRegisterInProcess = false
    this.isValidLogin = true
    this.isValidPassword = defaultIsValidPassword
    this.isRefreshTokenInProcess = false
  }

  setIsRefreshTokenInProcess = (value: boolean) => {
    this.isRefreshTokenInProcess = value
  }

  setIsValidLogin = (value: boolean) => {
    this.isValidLogin = value
  }

  setIsValidPassword = (value: PasswordValidateType) => {
    this.isValidPassword = value
  }

  setLogin = (text: string | undefined) => {
    this.login = text
  }

  setPassword = (text: string | undefined) => {
    this.password = text
  }

  setIsLoginInProcess = (value: boolean) => {
    this.isLoginInProcess = value
  }

  setIsRegisterInProcess = (value: boolean) => {
    this.isRegisterInProcess = value
  }

  setIsUserAuth = (value: boolean) => {
    this.isUserAuth = value
  }

  clearValidation = () => {
    this.setIsValidLogin(true)
    this.setIsValidPassword(defaultIsValidPassword)
  }

  validateLogin = (text: string) => {
    const trimmedText = text.trim()
    if (trimmedText.length < 3 || trimmedText.length > 20) {
      setTimeout(() => {
        this.setIsValidLogin(false)
      }, 500)
    }

    this.setIsValidLogin(true)
    this.setLogin(trimmedText)
  }
  validatePassword = (text: string) => {
    const trimmedPassword = text.trim()
    const {isValid, reason} = checkIsValidPassword(trimmedPassword)
    this.setIsValidPassword({isValid, reason})

    this.setPassword(trimmedPassword)
  }

  get checkIsUserAuth() {
    return this.isUserAuth
  }

  auth = async () => {
    try {
      this.setIsLoginInProcess(true)
      const {data} = await network.post('/auth/sign-in', {
        login: this.login,
        password: this.password,
      })
      if (!data.is_temporary_password) {
        this.rootStore.userStore.setTemporaryPassword(undefined)
        await removeTemporaryPassword()
      } else {
        this.rootStore.userStore.setTemporaryPassword(await getTemporaryPassword())
      }
      const {access_token, refresh_token, ...userData} = data
      this.rootStore.userStore.setCurrentUser(userData)
      await setToken(access_token)
      await setRefreshToken(refresh_token)
      this.setIsUserAuth(true)
    } catch (e) {
      console.log(e)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.clearValidation()
      this.setIsLoginInProcess(false)
    }
  }

  registration = async () => {
    try {
      this.setIsRegisterInProcess(true)
      const {data} = await network.post('/auth/sign-up', {
        login: this.login,
      })
      console.log(`data ${JSON.stringify(data)}`)
      const userData: UserType = {
        id: data.id,
        login: data.login,
        is_temporary_password: true,
      }
      this.rootStore.userStore.setTemporaryPassword(data.password)
      await setTemporaryPassword(data.password)
      this.rootStore.userStore.setCurrentUser(userData)
      await setToken(data.access_token)
      await setRefreshToken(data.refresh_token)
      this.setIsUserAuth(true)
    } catch (e) {
      console.log(e)
      console.log(e.response.data)
      console.log('registration error', JSON.stringify(e.response.data))
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.clearValidation()
      this.setIsRegisterInProcess(false)
    }
  }

  refreshToken = async () => {
    try {
      this.setIsRefreshTokenInProcess(true)
      const refreshToken = await getRefreshToken()
      const {data} = await network.post<TokensType>('/auth/refresh-tokens', undefined, {
        headers: {
          'Refresh-token': `Bearer ${refreshToken}`,
        },
      })
      await setToken(data.access_token)
      await setRefreshToken(data.refresh_token)
    } catch (e) {
      console.log(e)
      this.setIsUserAuth(false)
      await removeToken()
      await removeRefreshToken()
      cancelRequest('/auth/refresh-tokens')
    } finally {
      this.setIsRefreshTokenInProcess(false)
    }
  }
}

export type TAuthStore = AuthStore
