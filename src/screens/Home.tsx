import {KeyboardAvoidingView, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import ChatsListComponents from '../components/chat/chatsList.tsx'
import {defaultStyles} from '../common/styles/defaultStyles.ts'
import Header from '../components/header'
import {inject, observer} from 'mobx-react'
import {TUserStore} from '../stores/UserStore.ts'
import {Text} from '@ui-kitten/components'
import {Routers} from '../navigation/Routes.ts'
import {CoreTheme} from '../common/ui-kitten/theme.ts'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {PraktikaHomeInput} from '../components/Input'
import {TChatStore} from '../stores/ChatStore.ts'
import {rootStore} from '../RootNavigation.tsx'
import {ScreenLoader} from '../components/Loaders/ScreenLoader.tsx'
import {TPromptStore} from '../stores/PromptStore.ts'
import PromptsListComponents from '../components/prompts/promptList.tsx'
import {TGptStore} from '../stores/GptStore.ts'
import {getChatPhotoActionItems} from './chat/chatHelper.ts'
import {PraktikaActionSheet} from '../components/modals/ActionSheet.tsx'
import {TPhotoStore} from '../stores/PhotoStore.ts'

interface IProps {
  userStore?: TUserStore
  chatStore?: TChatStore
  promptStore?: TPromptStore
  gptStore?: TGptStore
  photoStore?: TPhotoStore
}

const Home = inject(
  'userStore',
  'chatStore',
  'promptStore',
  'gptStore',
  'photoStore',
)(
  observer(({userStore, chatStore, promptStore, gptStore, photoStore}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)

    useEffect(() => {
      ;(async () => {
        rootStore?.setIsShowLoader(true)
        if (!userStore?.currentUser) {
          await userStore?.getCurrentUser()
        }
        await chatStore?.getAllChats()
        await promptStore?.getPrompt()
        await gptStore?.getGptModels()
      })()
    }, [])

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
      if (!photoStore?.didCancel) {
        navigation.navigate(Routers.CHAT, {uploadPhotoModalVisible: true})
      }
    }

    const getHeaderTitle = () => {
      if (userStore?.currentUser?.login) {
        return `Привет, ${userStore?.currentUser?.login}`
      }

      return 'Привет'
    }

    return (
      <>
        {!chatStore?.isGetAllChatsInProcess ? (
          <SafeAreaView style={{display: 'flex', flex: 1}}>
            <StatusBar barStyle={'dark-content'} />
            <View style={defaultStyles.screenContainer}>
              <Header title={getHeaderTitle()} isShowBackArrow={false} user={userStore?.currentUser} />
              {userStore?.currentUser?.is_temporary_password && (
                <View style={styles.passwordErrorContainer}>
                  <Text style={styles.passwordErrorText} onPress={() => navigation.navigate(Routers.PROFILE)} children={'Необходимо сменить временный пароль'} />
                </View>
              )}
              <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={70} style={styles.container}>
                <PromptsListComponents />
                <ChatsListComponents />
                <PraktikaHomeInput setIsActionSheetVisible={setIsActionSheetVisible} />
              </KeyboardAvoidingView>
              <PraktikaActionSheet
                actionSheetVisible={isActionSheetVisible}
                actionItems={getChatPhotoActionItems(takePhoto, choosePhoto)}
                onCancel={() => setIsActionSheetVisible(false)}
                cancelText={'Закрыть'}
              />
            </View>
          </SafeAreaView>
        ) : (
          <ScreenLoader />
        )}
      </>
    )
  }),
)

export default Home

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginTop: 10,
  },
  passwordErrorContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CoreTheme['color-danger-500'],
    height: 50,
    marginBottom: 10,
  },
  passwordErrorText: {
    color: CoreTheme.white,
    textDecorationLine: 'underline',
  },
})
