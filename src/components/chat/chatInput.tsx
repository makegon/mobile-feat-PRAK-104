import {inject, observer} from 'mobx-react'
import {TChatStore} from '../../stores/ChatStore.ts'
import {KeyboardAvoidingView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Icon, IconProps, Input} from '@ui-kitten/components'
import {ResponseMessageTypes} from '../../common/enums.ts'
import React from 'react'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {defaultStyles} from '../../common/styles/defaultStyles.ts'

interface IProps {
  chatStore?: TChatStore
  sendMessage: (type: ResponseMessageTypes) => void
  setIsActionSheetVisible: (value: boolean) => void
  isModalVisible: boolean
}

export const ChatInput = inject('chatStore')(
  observer(({chatStore, sendMessage, setIsActionSheetVisible, isModalVisible}: IProps) => {
    const renderRightIcon = (props: IconProps) => (
      <TouchableOpacity activeOpacity={0.7} onPress={() => !chatStore?.isSendMessageInProcess && sendMessage(ResponseMessageTypes.TEXT)} disabled={chatStore?.isSendMessageInProcess}>
        <Icon {...props} name={'paper-plane-outline'} fill={chatStore?.isSendMessageInProcess ? CoreTheme['disable-color'] : CoreTheme['text-basic-color']} style={defaultStyles.icon} />
      </TouchableOpacity>
    )

    const renderLeftIcon = (props: IconProps) => (
      <TouchableOpacity activeOpacity={0.7} onPress={() => !chatStore?.isSendMessageInProcess && setIsActionSheetVisible(true)} disabled={chatStore?.isSendMessageInProcess}>
        <Icon {...props} name={'camera-outline'} fill={chatStore?.isSendMessageInProcess ? CoreTheme['disable-color'] : CoreTheme['text-basic-color']} style={defaultStyles.icon} />
      </TouchableOpacity>
    )

    return (
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={!isModalVisible ? 70 : -70} style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder={'Отправьте запрос или фото'}
          value={chatStore?.newMessage ?? ''}
          size={'large'}
          disabled={chatStore?.isSendMessageInProcess}
          multiline
          onChangeText={text => chatStore?.changeMessageText(text, ResponseMessageTypes.TEXT)}
          accessoryRight={renderRightIcon}
          accessoryLeft={renderLeftIcon}
        />
      </KeyboardAvoidingView>
    )
  }),
)

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: CoreTheme['placeholder-color'],
  },
})
