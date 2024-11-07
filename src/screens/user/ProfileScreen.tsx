import {inject, observer} from 'mobx-react'
import {TUserStore} from '../../stores/UserStore.ts'
import {KeyboardAvoidingView, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native'
import Header from '../../components/header'
import React, {useEffect} from 'react'
import {PraktikaButton} from '../../components/Buttons/PraktikaButton.tsx'
import {Routers} from '../../navigation/Routes.ts'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {ChangePasswordComponent} from '../../components/profile/changePasswordComponent.tsx'
import {rootStore} from '../../RootNavigation.tsx'

interface IProps {
  userStore?: TUserStore
}

const ProfileScreen = inject('userStore')(
  observer(({userStore}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
      return () => {
        userStore?.clearPasswords()
        userStore?.clearValidation()
      }
    }, [])

    const onChangePasswordPress = async () => {
      await userStore?.changePassword()
    }

    const getHeaderTitle = () => {
      if (userStore?.currentUser?.login) {
        return `${userStore?.currentUser?.login}`
      }

      return 'Профиль'
    }

    return (
      <SafeAreaView style={{display: 'flex', flex: 1}}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.container}>
          <Header title={getHeaderTitle()} isShowBackArrow={true} user={userStore?.currentUser} isNavigateEnabled={false} />
          <KeyboardAvoidingView behavior={'padding'}>
            <ChangePasswordComponent />
            <View style={styles.passwordContainer}>
              <PraktikaButton
                status={'primary'}
                onPress={onChangePasswordPress}
                size={'medium'}
                style={styles.button}
                disabled={!userStore?.validateAllPassword || userStore?.isChangePasswordInProcess}
                isLoading={userStore?.isChangePasswordInProcess}
                children={'Сменить пароль'}
              />
              <PraktikaButton status={'primary'} onPress={() => navigation.navigate(Routers.PAYWALL)} size={'medium'} style={styles.button} disabled={false} children={'Премиум'} />
              <PraktikaButton
                status={'danger'}
                appearance={'ghost'}
                onPress={async () => {
                  await rootStore.clearData()
                  navigation.navigate(Routers.REGISTRATION)
                }}
                size={'medium'}
                style={styles.button}
                children={'Выход'}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    )
  }),
)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  passwordContainer: {
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
  Userlogin: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
  },
})

export default ProfileScreen
