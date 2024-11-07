import {inject, observer} from 'mobx-react'
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native'
import {useEffect, useRef} from 'react'
import {Input, Text} from '@ui-kitten/components'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {PraktikaButton} from '../../components/Buttons/PraktikaButton.tsx'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {Routers} from '../../navigation/Routes.ts'
import {TAuthStore} from '../../stores/AuthStore.ts'

interface IProps {
  authStore?: TAuthStore
}

const RegistrationScreen = inject('authStore')(
  observer(({authStore}: IProps) => {
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

    const onLoginChange = (text: string) => {
      authStore?.validateLogin(text)
    }

    const onLoginPress = async () => {
      Keyboard.dismiss()
      await authStore?.registration()
    }

    const renderCaption = () => {
      if (!authStore?.isValidLogin) {
        return (
          <View>
            <Text style={styles.helperText} category={'p2'} status={'danger'} children={'Логин должен содержать не менее 3 символов и не более 20 символов'} />
          </View>
        )
      }
      return <></>
    }

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer} onTouchEnd={() => Keyboard.dismiss()}></View>
        <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={20} style={styles.inputContainer}>
          <Input
            ref={inputRef}
            placeholder={'Введите логин'}
            value={authStore?.login ?? ''}
            onChangeText={text => onLoginChange(text)}
            status={'basic'}
            size={'large'}
            caption={renderCaption}
            style={{...styles.input, ...(!authStore?.isValidLogin ? {borderColor: 'red', marginBottom: 2} : {})}}
          />
          <PraktikaButton
            status={'primary'}
            onPress={onLoginPress}
            size={'medium'}
            style={styles.button}
            disabled={!authStore?.isValidLogin || authStore?.isLoginInProcess}
            isLoading={authStore?.isLoginInProcess}
            children={'Зарегистрироваться'}
          />
          <Text onPress={() => navigation.navigate(Routers.AUTH)} style={{alignSelf: 'center', color: CoreTheme['color-primary-500'], textDecorationLine: 'underline'}} children={'Войти'} />
        </KeyboardAvoidingView>
      </View>
    )
  }),
)

export default RegistrationScreen

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
    marginBottom: 20,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
})
