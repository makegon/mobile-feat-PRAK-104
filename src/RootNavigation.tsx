import * as React from 'react'
import {useEffect} from 'react'
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native'
import RootStore from './stores/RootStore.ts'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {observer, Provider} from 'mobx-react'
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components'
import {Alert, Linking, Platform, StatusBar} from 'react-native'
import * as eva from '@eva-design/eva'
import {UiKitConfig} from './common/ui-kitten/config.ts'
import {CoreTheme} from './common/ui-kitten/theme.ts'
import {Routers} from './navigation/Routes.ts'
import {EvaIconsPack} from '@ui-kitten/eva-icons'
import {createNetworkService} from './utils/networkService.ts'
import {ToastMessage} from './components/toast'
import {ScreenLoader} from './components/Loaders/ScreenLoader.tsx'
import AppStack from './navigation/stack.tsx'
import {NotificationService} from './utils/notificationService.ts'
import AppMetrica from '@appmetrica/react-native-analytics'
import ApphudSdk from '@apphud/react-native-apphud-sdk'
import {getAppVersion, getDeviceId, isVersionLower} from './utils/helper.ts'
import remoteConfig from '@react-native-firebase/remote-config'
import {adapty, AdaptyError} from 'react-native-adapty'

export const navigationRef = createNavigationContainerRef<Routers>()
export const rootStore = RootStore
export const network = createNetworkService()

const stores = {
  rootStore,
  authStore: rootStore.authStore,
  promptStore: rootStore.promptStore,
  textStore: rootStore.textStore,
  photoStore: rootStore.photoStore,
  chatStore: rootStore.chatStore,
  userStore: rootStore.userStore,
  toastStore: rootStore.toastStore,
  premiumStore: rootStore.premiumStore,
  gptStore: rootStore.gptStore,
}

// const singularConfig = new SingularConfig('', '')

const onNavigationReady = async () => {
  try {
    AppMetrica.activate({
      apiKey: process.env.APPMETRICA_SDK_KEY ?? '2ba98bc1-4715-48c7-b9af-ba900085c10f',
      crashReporting: true,
      nativeCrashReporting: true,
      logs: true,
      statisticsSending: true,
    })
    // Singular.init(singularConfig)
    ApphudSdk.start({
      apiKey: process.env.APPHUD_API_KEY ?? 'app_y2ZdikF9eh6PA6Tu2nrJujYY95QNGe',
      deviceId: getDeviceId(),
    })
    ApphudSdk.enableDebugLogs()

    await adapty.activate('public_live_K8oxgVi4.0hweZVg4vFInFljOd3Ky', {
      logLevel: 'verbose',
    })
    console.log(`adapty activate success`)
    console.log(`adapty.isActivated() ${await adapty.isActivated()}`)
  } catch (e) {
    console.log(`adapty activate error ${JSON.stringify(e)}`)
  }
  await stores.rootStore.init()
}

const checkForUpdates = async () => {
  try {
    await remoteConfig().setDefaults({
      app_version_required_ios: '1.0.0',
      app_version_required_android: '1.0.0',
    })

    await remoteConfig().fetchAndActivate()

    const currentVersion = getAppVersion()
    const requiredVersion = Platform.select({
      ios: remoteConfig().getValue('app_version_required_ios').asString(),
      android: remoteConfig().getValue('app_version_required_android').asString(),
    })
    const storeLink = Platform.select({
      ios: remoteConfig().getValue('app_store_link').asString(),
      android: remoteConfig().getValue('google_play_link').asString(),
    })
    if (Platform.OS === 'ios' && requiredVersion && storeLink && isVersionLower(currentVersion.version, requiredVersion)) {
      showUpdateAlert(storeLink)
    }
  } catch (e) {
    console.log(`remoteConfig error ${JSON.stringify(e)}`)
  }
}

const showUpdateAlert = (storeLink: string) => {
  Alert.alert(
    'Ваше приложение устарело',
    'За это время мы стали лучше. Обновите приложение и возвращайтесь к нам.',
    [
      {
        text: 'Обновить приложение',
        onPress: () => {
          Linking.openURL(storeLink)
        },
      },
    ],
    {cancelable: false},
  )
}

// const requestPhotoPermissions = async () => {
//   try {
//     if (Platform.OS === 'ios') {
//       const cameraPermission = await request(PERMISSIONS.IOS.CAMERA)
//       const photoLibraryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
//       console.log(`cameraPermission => ${cameraPermission}, photoLibraryPermission => ${photoLibraryPermission}`)
//     } else if (Platform.OS === 'android') {
//       const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA)
//       const storagePermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
//       console.log(`cameraPermission => ${cameraPermission}, storagePermission => ${storagePermission}`)
//     }
//   } catch (error) {
//     console.error('Ошибка при запросе разрешений:', error)
//   }
// }

const RootNavigation = () => {
  useEffect(() => {
    ;(async () => {
      await checkForUpdates()
      //await requestPhotoPermissions()
      await NotificationService.getService().initNotificationService()
    })()
  }, [])

  return (
    <SafeAreaProvider>
      <Provider {...stores}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{...eva.light, ...CoreTheme}} customMapping={UiKitConfig}>
          <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
            <StatusBar animated barStyle={'dark-content'} backgroundColor={CoreTheme['background-color']} />
            <AppStack />
          </NavigationContainer>
          <ToastMessage />
          {rootStore.isShowLoader && <ScreenLoader />}
        </ApplicationProvider>
      </Provider>
    </SafeAreaProvider>
  )
}

export default observer(RootNavigation)
