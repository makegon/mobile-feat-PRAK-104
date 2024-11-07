import {inject, observer} from 'mobx-react'
import {Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import {Icon, IconProps, Input, Text} from '@ui-kitten/components'
import {defaultStyles} from '../../common/styles/defaultStyles.ts'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {PraktikaButton} from '../../components/Buttons/PraktikaButton.tsx'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {Routers} from '../../navigation/Routes.ts'
import {TAuthStore} from '../../stores/AuthStore.ts'

interface IProps {
  authStore?: TAuthStore
}

const AuthScreen = inject('authStore')(
  observer(({authStore}: IProps) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const inputRef = useRef<Input>(null)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
      const keyboardDidHide = Keyboard.addListener('keyboardDidHide', e => {
        inputRef?.current?.blur()
      })

      return () => {
        keyboardDidHide.remove()
      }
    }, [])

    const toggleSecureEntry = (): void => {
      setSecureTextEntry(!secureTextEntry)
    }

    const onLoginChange = (text: string) => {
      authStore?.validateLogin(text)
    }

    const onLoginPress = async () => {
      await authStore?.auth()
    }

    const onPasswordChange = (text: string) => {
      authStore?.validatePassword(text)
    }

    const renderIcon = (props: IconProps) => (
      <Pressable onPress={toggleSecureEntry}>
        <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} fill={CoreTheme['text-basic-color']} />
      </Pressable>
    )

    const renderLoginCaption = () => {
      if (!authStore?.isValidLogin) {
        return (
          <View>
            <Text style={styles.helperText} category={'p2'} status={'danger'} children={'Логин должен содержать не менее 3 символов и не более 20 символов'} />
          </View>
        )
      }
      return <></>
    }

    const renderPasswordCaption = () => {
      if (!authStore?.isValidPassword?.isValid && !!authStore?.isValidPassword?.reason) {
        return (
          <View>
            <Text style={styles.helperText} category={'p2'} status={'danger'} children={`${authStore?.isValidPassword.reason}`} />
          </View>
        )
      }
      return <></>
    }

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer} onTouchEnd={() => Keyboard.dismiss()}></View>
        <KeyboardAvoidingView keyboardVerticalOffset={30} behavior={'padding'} style={styles.inputContainer}>
          <Input
            ref={inputRef}
            placeholder={'Введите логин'}
            value={authStore?.login ?? ''}
            onChangeText={text => onLoginChange(text)}
            status={'basic'}
            size={'large'}
            caption={renderLoginCaption}
            style={{...styles.input, ...(!authStore?.isValidLogin ? {borderColor: 'red', marginBottom: 2} : {})}}
            // accessoryRight={<Icon name={'paper-plane-outline'} style={defaultStyles.icon} fill={CoreTheme['text-basic-color']} />}
          />
          <Input
            ref={inputRef}
            placeholder={'Введите пароль'}
            value={authStore?.password ?? ''}
            onChangeText={text => onPasswordChange(text)}
            status={'basic'}
            size={'large'}
            caption={renderPasswordCaption}
            style={{
              ...styles.input,
              ...(!authStore?.isValidPassword
                ? {
                    borderColor: 'red',
                    marginBottom: 2,
                  }
                : {marginBottom: 20}),
            }}
            secureTextEntry={secureTextEntry}
            accessoryRight={renderIcon}
          />
          <PraktikaButton
            status={'primary'}
            onPress={onLoginPress}
            size={'medium'}
            style={styles.button}
            disabled={!authStore?.isValidLogin || !authStore?.isValidPassword.isValid || authStore?.isLoginInProcess}
            isLoading={authStore?.isLoginInProcess}
            children={'Войти'}
          />
          <Text
            onPress={() => navigation.navigate(Routers.REGISTRATION)}
            style={{alignSelf: 'center', color: CoreTheme['color-primary-500'], textDecorationLine: 'underline'}}
            children={'Зарегистрироваться'}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }),
)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  imageContainer: {
    display: 'flex',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: 40,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
})

export default AuthScreen
