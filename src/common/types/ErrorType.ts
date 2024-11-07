import {BaseErrorCodes} from '../constants.ts'

export type ErrorType = {
  code: string
  message: string
}

export type BaseErrorCodeNames = keyof typeof BaseErrorCodes
