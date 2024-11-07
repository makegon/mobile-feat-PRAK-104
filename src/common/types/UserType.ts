export type UserRegistrationType = {
  id: 0
  login: string
  password: string
  access_token: string
  refresh_token: string
}

export type UserType = {
  id: number
  login: string
  is_temporary_password: boolean
  selected_model_id: number
}

export type TokensType = {
  access_token: string
  refresh_token: string
}

export type UserLoginType = UserType & TokensType

export type StorageTokenType = {
  access_token?: string | null
}

export type PasswordValidateType = {
  isValid: boolean
  reason?: string
}

export type ValidatorType = {
  setIsValid: (value: PasswordValidateType) => void
  setPassword: (password: string) => void
}
