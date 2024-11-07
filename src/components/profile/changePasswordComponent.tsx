import {Text, TextProps} from '@ui-kitten/components'
import {ChangePasswordTypes} from '../../common/enums.ts'
import {KeyboardAvoidingView, StyleSheet} from 'react-native'
import React, {useState} from 'react'
import {inject, observer} from 'mobx-react'
import {TUserStore} from '../../stores/UserStore.ts'
import {PasswordValidateType} from '../../common/types/UserType.ts'
import {PasswordInput} from '../Input/passwordInput.tsx'
import {usePasswordToggle} from '../../utils/hooks/password/usePasswordToggle.ts'
import {RenderProp} from '@ui-kitten/components/devsupport'

interface IProps {
  userStore?: TUserStore
}

export const ChangePasswordComponent = inject('userStore')(
  observer(({userStore}: IProps) => {
    const [secureOldPassword, toggleSecureOldPassword] = useState(true)
    const [secureNewPassword, toggleSecureNewPassword] = useState(true)
    const [secureNewPasswordRepeat, toggleSecureNewPasswordRepeat] = useState(true)

    const onPasswordChange = (text: string, type: ChangePasswordTypes) => {
      userStore?.validatePassword(text, type)
    }

    const renderCaption = (isValid: PasswordValidateType | undefined, isRepeatPassword?: boolean): RenderProp<TextProps> => {
      if (isRepeatPassword && !userStore?.validateNewPasswords) {
        return (
          <Text category={'p2'} status={'danger'}>
            Пароли не совпадают
          </Text>
        )
      }

      if (isValid && !isValid.isValid && isValid.reason) {
        return (
          <Text category={'p2'} status={'danger'}>
            {isValid.reason}
          </Text>
        )
      }

      return <Text children={''} />
    }

    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.passwordContainer}>
        <PasswordInput
          placeholder={'Введите старый пароль'}
          value={userStore?.temporaryPassword ?? userStore?.oldPassword ?? ''}
          onChangeText={text => onPasswordChange(text, ChangePasswordTypes.OLD)}
          isValid={userStore?.isValidOldPassword}
          toggleSecure={() => toggleSecureOldPassword(!secureOldPassword)}
          secureTextEntry={secureOldPassword}
          renderCaption={renderCaption(userStore?.isValidOldPassword)}
        />
        <PasswordInput
          placeholder={'Введите новый пароль'}
          value={userStore?.password ?? ''}
          onChangeText={text => onPasswordChange(text, ChangePasswordTypes.NEW)}
          isValid={userStore?.isValidPassword}
          toggleSecure={() => toggleSecureNewPassword(!secureNewPassword)}
          secureTextEntry={secureNewPassword}
          renderCaption={renderCaption(userStore?.isValidPassword)}
        />
        <PasswordInput
          placeholder={'Введите новый пароль еще раз'}
          value={userStore?.passwordRepeat ?? ''}
          onChangeText={text => onPasswordChange(text, ChangePasswordTypes.NEW_REPEAT)}
          isValid={userStore?.isValidPasswordRepeat}
          toggleSecure={() => toggleSecureNewPasswordRepeat(!secureNewPasswordRepeat)}
          secureTextEntry={secureNewPasswordRepeat}
          renderCaption={renderCaption(userStore?.isValidPasswordRepeat, true)}
        />
      </KeyboardAvoidingView>
    )
  }),
)

const styles = StyleSheet.create({
  passwordContainer: {
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
  },
})
