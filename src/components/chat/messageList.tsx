import {inject, observer} from 'mobx-react'
import {ActivityIndicator, StyleSheet, View} from 'react-native'
import React, {useCallback, useEffect} from 'react'
import {TChatStore} from '../../stores/ChatStore.ts'
import {FlashList} from '@shopify/flash-list'
import {MessageType} from '../../common/types/MessageType.ts'
import {ChatRoles} from '../../common/enums.ts'
import {prepareMessageListData} from '../../screens/chat/chatHelper.ts'
import {TypingIndicator} from './typingIndicator.tsx'
import {MessageItem} from './messageItem.tsx'
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes'
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView'
import {CoreTheme} from "../../common/ui-kitten/theme.ts";

interface IProps {
  chatStore?: TChatStore
}

export interface RenderMessageItemProps {
  item: MessageType | {id: string; role: ChatRoles; message: string}
}

const MessageList = inject('chatStore')(
  observer(({chatStore}: IProps) => {
    const data = prepareMessageListData(chatStore?.messages || [], chatStore?.isGptTyping || false, chatStore?.tempMessage || null)

    useEffect(() => {
      console.log(`messages ${JSON.stringify(chatStore?.messages)}`)
    }, [chatStore?.messages])

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset} = event.nativeEvent
      const distanceFromTop = contentOffset.y
      const threshold = 3 * 60

      if (distanceFromTop < threshold && !chatStore?.isLoadingMore && !chatStore?.isAllMessagesLoaded) {
        chatStore?.loadMoreMessages()
      }
    }

    const renderItem = useCallback(
      ({item}: {item: MessageType}) => {
        if (typeof item.id === 'string' && item.id === 'tempMessage') {
          return (
            <View style={[styles.messageContainer, styles.otherMessage]}>
              <TypingIndicator tempMessage={chatStore?.tempMessage?.message} />
            </View>
          )
        }
        return <MessageItem messageItem={item as MessageType} />
      },
      [chatStore?.messages],
    )

    return (
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        estimatedItemSize={60}
        inverted
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        ListFooterComponent={chatStore?.isGetChatInProcess && !chatStore?.isAllMessagesLoaded ? <ActivityIndicator style={styles.loadingIndicator} /> : null}
      />
    )
  }),
)

export default MessageList

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  otherMessage: {
    backgroundColor: CoreTheme['gpt-message-color'],
    alignSelf: 'flex-start',
  },
  loadingIndicator: {
    padding: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
})
