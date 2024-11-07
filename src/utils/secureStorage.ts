
import {StorageTokenType} from '../common/types/UserType.ts'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FIRST_LAUNCH = 'FIRST_LAUNCH'
const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const TEMPORARY_PASSWORD = 'temporary_password'
const PUSH_TOKEN = 'push_token'
const SHARED_PERFS = 'ObytesSharedPerfs'
const KEYCHAIN_SERVICE = 'ObytesKeychain'

const keyChainOptions = {
  sharedPreferencesName: SHARED_PERFS,
  keychainService: KEYCHAIN_SERVICE,
}

export async function deleteAllStorageData(): Promise<void> {
  await AsyncStorage.removeItem(FIRST_LAUNCH)
  await AsyncStorage.removeItem(ACCESS_TOKEN)
  await AsyncStorage.removeItem(REFRESH_TOKEN)
  await AsyncStorage.removeItem(TEMPORARY_PASSWORD)
  await AsyncStorage.removeItem(PUSH_TOKEN)
}

export async function getItem<T>(key: string): Promise<T | null> {
  let attempts = 3
  while (attempts > 0) {
    try {
      const value = await AsyncStorage.getItem(key)
      console.log(`value`)
      return value ? JSON.parse(value)?.[key] || null : null
    } catch (e) {
      attempts--
      if (attempts !== 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
  return null
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify({[key]: value}))
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key)
}

export const getToken = async () => await getItem<string>(ACCESS_TOKEN)
export const setToken = async (value: string) => await setItem<string>(ACCESS_TOKEN, value)
export const removeToken = async () => await removeItem(ACCESS_TOKEN)

export const getRefreshToken = async () => await getItem<string>(REFRESH_TOKEN)
export const setRefreshToken = async (value: string) => await setItem<string>(REFRESH_TOKEN, value)
export const removeRefreshToken = async () => await removeItem(REFRESH_TOKEN)

export const getPushToken = async () => await getItem<string>(PUSH_TOKEN)
export const setPushToken = async (value: string) => await setItem<string>(PUSH_TOKEN, value)
export const removePushToken = async () => await removeItem(PUSH_TOKEN)

export const getUserDataForAuth = async (): Promise<StorageTokenType> => {
  const token = await getToken()
  return {
    access_token: token ?? null,
  }
}

export const getTemporaryPassword = async () => await getItem<string>(TEMPORARY_PASSWORD)
export const setTemporaryPassword = async (value: string) => await setItem<string>(TEMPORARY_PASSWORD, value)
export const removeTemporaryPassword = async () => await removeItem(TEMPORARY_PASSWORD)
