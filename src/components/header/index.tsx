import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {useNavigation} from '@react-navigation/native'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Icon} from '@ui-kitten/components'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {UserType} from '../../common/types/UserType.ts'
import {defaultStyles} from '../../common/styles/defaultStyles.ts'
import {Routers} from '../../navigation/Routes.ts'

interface IProps {
  title: string
  isShowBackArrow?: boolean
  user: UserType | undefined
  isNavigateEnabled?: boolean
}

const Header = ({title, isShowBackArrow = false, user, isNavigateEnabled = true}: IProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const onBackPress = () => {
    navigation.goBack()
  }

  const renderLeftArrow = () => (
    <TouchableOpacity activeOpacity={0.7} onPress={onBackPress} style={styles.iconsContainer}>
      <Icon name={'chevron-left-outline'} fill={CoreTheme['text-basic-color']} style={defaultStyles.icon} />
    </TouchableOpacity>
  )

  const onAvatarPress = () => {
    if (isNavigateEnabled) {
      navigation.navigate(Routers.PROFILE)
    }
  }

  const renderAvatar = () => {
    if (!user) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={onAvatarPress} style={styles.avatar}>
          <Text style={styles.avatarTitle} children={'P'} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={onAvatarPress} style={styles.avatar}>
          <Text style={styles.avatarTitle} children={user.login[0].toUpperCase()} />
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={styles.container}>
      {isShowBackArrow && renderLeftArrow()}
      <Text style={defaultStyles.headerTitle} children={title} />
      {renderAvatar()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  iconsContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  avatar: {
    display: 'flex',
    backgroundColor: CoreTheme['avatar-background'],
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  avatarTitle: {
    color: CoreTheme.white,
    fontWeight: '600',
    fontSize: 20,
  },
})

export default Header
