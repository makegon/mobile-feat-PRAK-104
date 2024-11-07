import {ErrorType} from './types/ErrorType.ts'

export const requestTimeout = 30 * 1000

export const REQUEST_FAILED_401 = 'Request failed with status code 401'

export const BaseErrorCodes: Record<string, ErrorType> = {
  LOGIN_IS_EMPTY: {
    code: 'LOGIN_IS_EMPTY',
    message: 'The login cannot be empty',
  },
  LOGIN_IS_NOT_A_STRING: {
    code: 'LOGIN_IS_NOT_A_STRING',
    message: 'The login must be a string',
  },
  LOGIN_WRONG_LENGTH: {
    code: 'LOGIN_WRONG_LENGTH',
    message: 'The length of the login must be at least 3 and no more than 20 characters',
  },
  PASSWORD_IS_EMPTY: {
    code: 'PASSWORD_IS_EMPTY',
    message: 'The password cannot be empty',
  },
  PASSWORD_IS_NOT_A_STRING: {
    code: 'PASSWORD_IS_NOT_A_STRING',
    message: 'The password must be a string',
  },
  PASSWORD_WRONG_LENGTH: {
    code: 'PASSWORD_WRONG_LENGTH',
    message: 'The length of the password must be at least 5 and no more than 40 characters',
  },
  PASSWORD_MUST_BE_STRONG: {
    code: 'PASSWORD_MUST_BE_STRONG',
    message: 'The password must be strong, it must contain at least one: a lowercase character, an uppercase character, a symbol and a number',
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    message: 'The password is wrong',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'The user is not found',
  },
  USER_ALREADY_EXIST: {
    code: 'USER_ALREADY_EXISTS',
    message: 'The user already exists',
  },
  GPT_SERVICE_NOT_AVAILABLE: {
    code: 'GPT_SERVICE_NOT_AVAILABLE',
    message: 'The GPT service is not available',
  },
  GPT_MODEL_NOT_FOUND: {
    code: 'GPT_MODEL_NOT_FOUND',
    message: 'GPT model is not found',
  },
  CHAT_NOT_FOUND: {
    code: 'CHAT_NOT_FOUND',
    message: 'Chat is not found',
  },
  MESSAGE_NOT_FOUND: {
    code: 'MESSAGE_NOT_FOUND',
    message: 'Message is not found',
  },
  CATEGORY_NOT_FOUND: {
    code: 'CATEGORY_NOT_FOUND',
    message: 'Category is not found',
  },
  PROMPT_NOT_FOUND: {
    code: 'PROMPT_NOT_FOUND',
    message: 'Prompt is not found',
  },
  GPT_MANAGER_NOT_INITIALIZED: {
    code: 'GPT_MANAGER_NOT_INITIALIZED',
    message: 'GPT manager is not initialized',
  },
}
