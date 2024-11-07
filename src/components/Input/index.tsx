import {Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {Icon, Input} from '@ui-kitten/components'
import {defaultStyles} from '../../common/styles/defaultStyles.ts'
import {useEffect, useRef, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {Routers} from '../../navigation/Routes.ts'
import {inject, observer} from 'mobx-react'
import {TChatStore} from '../../stores/ChatStore.ts'
import {ResponseMessageTypes} from '../../common/enums.ts'

interface IProps {
  chatStore?: TChatStore
  setIsActionSheetVisible: (value: boolean) => void
}

export const PraktikaHomeInput = inject('chatStore')(
  observer(({chatStore, setIsActionSheetVisible}: IProps) => {
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

    const onChange = (text: string) => {
      chatStore?.setNewMessage(text)
    }

    const onSendMessage = () => {
      navigation.navigate(Routers.CHAT)
    }

    const onSendPhoto = () => {
      navigation.navigate(Routers.CHAT)
    }

    const renderRight = () => (
      <TouchableOpacity activeOpacity={0.7} onPress={onSendMessage} style={styles.iconContainer}>
        <Icon name={'paper-plane-outline'} fill={CoreTheme['text-basic-color']} style={defaultStyles.icon} />
      </TouchableOpacity>
    )

    const renderLeft = () => (
      <TouchableOpacity activeOpacity={0.7} onPress={() => setIsActionSheetVisible(true)} style={styles.iconContainer}>
        <Icon name={'camera-outline'} fill={CoreTheme['text-basic-color']} style={defaultStyles.icon} />
      </TouchableOpacity>
    )

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            ref={inputRef}
            style={{...styles.input}}
            placeholder={'Отправьте запрос или фото'}
            value={chatStore?.newMessage ?? ''}
            size={'large'}
            multiline
            onChangeText={text => onChange(text)}
            accessoryLeft={renderLeft}
            accessoryRight={renderRight}
          />
        </View>
      </View>
    )
  }),
)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: CoreTheme['placeholder-color'],
    zIndex: 2,
  },
  iconContainer: {
    display: 'flex',
    alignSelf: 'flex-end',
    borderRadius: 50,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  inputContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  input: {
    borderWidth: 0,
  },
})
