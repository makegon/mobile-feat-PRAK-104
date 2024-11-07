import {inject, observer} from 'mobx-react'
import {TChatStore} from '../../stores/ChatStore.ts'
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native'
import {defaultStyles} from '../../common/styles/defaultStyles.ts'
import Header from '../../components/header'
import {TUserStore} from '../../stores/UserStore.ts'
import React, {useEffect, useState} from 'react'
import MessageList from '../../components/chat/messageList.tsx'
import {ScreenLoader} from '../../components/Loaders/ScreenLoader.tsx'
import {RouteProp} from '@react-navigation/native'
import {PraktikaActionSheet} from '../../components/modals/ActionSheet.tsx'
import {BaseModalComponent} from '../../components/modals/BaseModal.tsx'
import {TPhotoStore} from '../../stores/PhotoStore.ts'
import {PhotoMessageModal} from '../../components/modals/photoMessageModal.tsx'
import {getChatPhotoActionItems} from './chatHelper.ts'
import {ResponseMessageTypes} from '../../common/enums.ts'
import {ChatInput} from '../../components/chat/chatInput.tsx'
import {ChatLoader} from '../../components/Loaders/ChatLoader.tsx'

interface ChatScreenRouteParams {
  chatId?: string
  promptId?: string
  uploadPhotoModalVisible?: boolean
}

interface IProps {
  chatStore?: TChatStore
  userStore?: TUserStore
  photoStore?: TPhotoStore
  route: RouteProp<{ChatScreen: ChatScreenRouteParams}, 'ChatScreen'>
}

const ChatScreen = inject(
  'chatStore',
  'userStore',
  'photoStore',
)(
  observer(({chatStore, userStore, route, photoStore}: IProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)
    const uploadPhoto = !!route?.params?.uploadPhotoModalVisible ? route?.params?.uploadPhotoModalVisible : undefined
    const chatId = !!route?.params?.chatId ? route.params.chatId : undefined
    const promptId = !!route?.params?.promptId ? route.params.promptId : undefined

    useEffect(() => {
      ;(async () => {
        await chatStore?.initChat(chatId, promptId)

        setTimeout(() => {
          if (uploadPhoto) {
            setIsModalVisible(true)
          }
        }, 1000)
      })()

      return () => {
        chatStore?.clearChatData()
      }
    }, [])

    useEffect(() => {
      console.log('Modal visible::::', isModalVisible)
    }, [isModalVisible])

    useEffect(() => {
      if (!chatId && chatStore?.newMessage && chatStore?.newMessage.length > 0 && chatStore?.currentChat?.id) {
        sendMessage(ResponseMessageTypes.TEXT)
      }
    }, [chatStore?.currentChat])

    const takePhoto = async () => {
      await photoStore?.takePhoto()
      setIsActionSheetVisible(false)
      enableModal()
    }

    const choosePhoto = async () => {
      await photoStore?.chooseFromGallery()
      setIsActionSheetVisible(false)
      enableModal()
    }

    const enableModal = () => {
      setTimeout(() => {
        if (!photoStore?.didCancel) {
          setIsModalVisible(true) //TODO понять почему не работает без таймера
          //TODO Attempt to present <RCTModalHostViewController: 0x117982cd0> on <UIViewController: 0x10a0189f0> (from <RNSScreen: 0x10b89f800>) while a presentation is in progress.
        }
      }, 1000)
    }

    const sendMessage = (type: ResponseMessageTypes) => {
      if (!chatStore?.currentChat?.id && !chatId) {
        return
      }
      const id = chatStore?.currentChat?.id ? chatStore?.currentChat?.id : chatId ? chatId : undefined
      chatStore?.createNewMessage(type, id, () => setIsModalVisible(false))
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        {!chatStore?.isChatLoading && chatStore?.isConnected ? (
          <View style={defaultStyles.screenContainer}>
            <Header title={'Чат'} user={userStore?.currentUser} isShowBackArrow />
            {/*<ChooseGptModelComponent />*/}
            <View style={styles.messageListContainer}>
              <MessageList />
            </View>
            <ChatInput setIsActionSheetVisible={setIsActionSheetVisible} sendMessage={sendMessage} isModalVisible={isModalVisible} />
          </View>
        ) : (
          <ScreenLoader />
        )}
        {isModalVisible && <BaseModalComponent visible={true} children={<PhotoMessageModal onSend={() => sendMessage(ResponseMessageTypes.IMAGE)} onCancel={() => setIsModalVisible(false)} />} />}
        <PraktikaActionSheet
          actionSheetVisible={isActionSheetVisible}
          actionItems={getChatPhotoActionItems(takePhoto, choosePhoto)}
          onCancel={() => setIsActionSheetVisible(false)}
          cancelText={'Закрыть'}
        />
        {chatStore?.isSendMessageInProcess && <ChatLoader />}
      </SafeAreaView>
    )
  }),
)

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageListContainer: {
    paddingHorizontal: 10,
    flexGrow: 1,
    flex: 1,
    marginBottom: 10,
  },
})
