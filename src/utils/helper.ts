import * as RNLocalize from 'react-native-localize'
import DeviceInfo from 'react-native-device-info'
import {AppVersionType} from '../common/types/AppVersionType.ts'
import {PasswordValidateType} from '../common/types/UserType.ts'

export const getDeviceLocale = () => {
  return RNLocalize.getLocales()[0].languageCode ?? process.env.DEFAULT_LANGUAGE_CODE ?? 'en'
}

export const getDeviceId = () => {
  return DeviceInfo.getDeviceId()
}

export const getAppVersion = (): AppVersionType => {
  return {
    version: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
  }
}

export const convertTime = () => {}

export const checkIsValidPassword = (trimmedPassword: string) => {
  const validateChecks: PasswordValidateType[] = [
    {isValid: trimmedPassword.length >= 5, reason: 'Пароль должен содержать как минимум 5 символов.'},
    {isValid: /[A-Z]/.test(trimmedPassword), reason: 'Пароль должен содержать как минимум одну заглавную букву.'},
    {isValid: /[a-z]/.test(trimmedPassword), reason: 'Пароль должен содержать как минимум одну строчную букву.'},
    {
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword),
      reason: 'Пароль должен содержать как минимум один специальный символ.',
    },
    {isValid: /\d/.test(trimmedPassword), reason: 'Пароль должен содержать как минимум одну цифру.'},
  ]
  const invalidCheck = validateChecks.find(check => !check.isValid)

  return {
    isValid: !invalidCheck,
    reason: invalidCheck?.reason,
  }
}

export const defaultIsValidPassword: PasswordValidateType = {
  isValid: true,
  reason: undefined,
}

export const isVersionLower = (current: string, required: string) => {
  const currentParts = current.split('.').map(Number)
  const requiredParts = required.split('.').map(Number)

  for (let i = 0; i < requiredParts.length; i++) {
    if (currentParts[i] < requiredParts[i]) return true
    if (currentParts[i] > requiredParts[i]) return false
  }
  return false
}
