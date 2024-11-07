import {AuthorizationStatus} from '@notifee/react-native'
import FBMessaging from '@react-native-firebase/messaging'
import {getPushToken, removePushToken, setPushToken} from './secureStorage.ts'
import Clipboard from '@react-native-clipboard/clipboard'
import {Platform} from 'react-native'

export class NotificationService {
  private static instance: NotificationService
  private readonly isPushServiceCanBeRun: boolean = false
  private readonly isPushServiceProcess: boolean = false

  constructor() {
    this.isPushServiceCanBeRun = true
    this.isPushServiceProcess = true
  }

  get isNotificationServiceCanBeRunning() {
    if (!this.isPushServiceCanBeRun) {
      console.log(`NotificationService does not support on this device`)
    }

    return this.isPushServiceCanBeRun
  }

  async initNotificationService() {
    if (!this.isNotificationServiceCanBeRunning) {
      console.log(`return`)
      return
    }

    console.log(`init notification`)
    // await this.requestUserPermission()
    const authorizationStatus = await FBMessaging().requestPermission()
    console.log(`authStatus ${authorizationStatus}`)

    await FBMessaging().registerDeviceForRemoteMessages()
    FBMessaging()
      .getToken()
      .then(
        token => {
          Clipboard.setString(token ?? 'Token doesnt exist check FCM integration')
          console.log(`PUSH Token copy to clipboard => ${token}`)
        },
        error => {
          Clipboard.setString(error ?? 'Token doesnt exist check FCM integration')
          console.log('Error:', error)
        },
      )

    FBMessaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('getInitialNotification:' + 'Notification caused app to open from quit state')
          console.log(remoteMessage)
        }
      })

    FBMessaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        console.log('onNotificationOpenedApp: ' + 'Notification caused app to open from background state')
        console.log(remoteMessage)
      }
    })

    FBMessaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage)
    })
  }

  async refreshPushToken() {
    if (!this.isNotificationServiceCanBeRunning) {
      return
    }

    try {
      return FBMessaging().onTokenRefresh(async token => {
        if (!FBMessaging().isDeviceRegisteredForRemoteMessages) {
          await FBMessaging().registerDeviceForRemoteMessages()
        }
        await this.updatePushToken(token)
      })
    } catch (e) {
      console.log('refreshPushToken', e)
    }
  }

  async clearPushToken() {
    if (!this.isNotificationServiceCanBeRunning) {
      return
    }

    try {
      await FBMessaging().deleteToken()
      await removePushToken()
    } catch (e) {
      console.log('clearPushToken', e)
    }
  }

  static getService(): NotificationService {
    if (NotificationService.instance?.isPushServiceProcess !== true) {
      NotificationService.instance = new NotificationService()
    }

    return NotificationService.instance
  }

  async requestUserPermission() {
    try {
      const authStatus = await FBMessaging().requestPermission()

      return authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL
    } catch (e) {
      console.log(`requestUserPermission error ${JSON.stringify(e)}`)
    }
  }

  private async updatePushToken(token: string) {
    if (!this.isNotificationServiceCanBeRunning) {
      return
    }

    const lastToken = await getPushToken()
    if (lastToken !== token) {
      try {
        await setPushToken(token)
      } catch (e) {
        //TODO добавить отображение тоста?
        console.log(`Error register FCMtoken`)
      }
    }
  }
}

export interface INotificationService extends NotificationService {}
