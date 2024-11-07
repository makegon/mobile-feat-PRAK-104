// import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {inject, observer} from 'mobx-react'
import {Routers} from './Routes.ts'
import AuthScreen from '../screens/Auth/AuthScreen.tsx'
import RegistrationScreen from '../screens/Auth/RegistrationScreen.tsx'
import {CoreTheme} from '../common/ui-kitten/theme.ts'
import Home from '../screens/Home.tsx'
import ProfileScreen from '../screens/user/ProfileScreen.tsx'
import {PaywallScreen} from '../screens/billing/PaywallScreen.tsx'
import * as React from 'react'
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack'
import {TAuthStore} from '../stores/AuthStore.ts'
import ChatScreen from '../screens/chat/ChatScreen.tsx'

const AppStack = createStackNavigator()

interface IProps {
  authStore?: TAuthStore
}

export default inject('authStore')(
  observer(({authStore}: IProps) => {
    // const nav = useNavigation<NativeStackNavigationProp<any>>()

    const authScreens = () => {
      return (
        <AppStack.Group
          screenOptions={({navigation}) => ({
            title: '',
            headerTransparent: true,
            headerShown: false,
            headerShadowVisible: false,
            cardStyle: {
              backgroundColor: CoreTheme.white,
            },
          })}>
          <AppStack.Screen name={Routers.REGISTRATION} component={RegistrationScreen} />
          <AppStack.Screen name={Routers.AUTH} component={AuthScreen} />
        </AppStack.Group>
      )
    }

    const mainScreens = () => {
      return (
        <AppStack.Group
          screenOptions={({navigation}) => ({
            title: '',
            headerTransparent: true,
            headerShown: false,
            headerShadowVisible: false,
            cardStyle: {
              backgroundColor: CoreTheme.white,
            },
          })}>
          <AppStack.Screen name={Routers.HOME} component={Home} />
          <AppStack.Screen
            name={Routers.CHAT}
            component={ChatScreen}
            options={{
              gestureDirection: 'vertical',
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
          <AppStack.Screen name={Routers.PROFILE} component={ProfileScreen} />
          <AppStack.Screen name={Routers.PAYWALL} component={PaywallScreen} />
        </AppStack.Group>
      )
    }

    return <AppStack.Navigator>{authStore?.checkIsUserAuth ? mainScreens() : authScreens()}</AppStack.Navigator>
  }),
)
