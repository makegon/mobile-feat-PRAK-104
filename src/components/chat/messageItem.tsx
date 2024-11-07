import {Image, StyleSheet, Text, View} from 'react-native'
import {MessageType} from '../../common/types/MessageType.ts'
import {ChatRoles} from '../../common/enums.ts'
import React from 'react'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'

interface IProps {
  messageItem: MessageType
}

export const MessageItem = ({messageItem}: IProps) => (
  <View style={[styles.messageContainer, messageItem.role === ChatRoles.USER ? styles.myMessage : styles.otherMessage]}>
    {messageItem?.images && messageItem.images.length ? <Image source={{uri: messageItem.images[0]}} style={styles.messageImage} /> : <></>}
    {messageItem?.message ? <Text style={styles.messageText}>{messageItem.message}</Text> : <></>}
  </View>
)

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: CoreTheme['color-primary'],
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: CoreTheme['gpt-message-color'],
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: CoreTheme['text-basic-color'],
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
})
