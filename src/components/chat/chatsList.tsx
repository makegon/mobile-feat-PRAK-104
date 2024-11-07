import {inject, observer} from 'mobx-react'
import React, {useEffect} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {TChatStore} from '../../stores/ChatStore.ts'
import {ChatType} from '../../common/types/ChatType.ts'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {Routers} from '../../navigation/Routes.ts'
import {Icon, Text} from '@ui-kitten/components'
import {PromptType} from '../../common/types/PromptType.ts'
import {FlashList} from '@shopify/flash-list'
import Skeleton from '@thevsstech/react-native-skeleton'
import {SKELETON_COUNT} from '../prompts/promptList.tsx'

interface IProps {
  chatStore?: TChatStore
}

const ChatsListComponents = inject('chatStore')(
  observer(({chatStore}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    const onChatClick = (chat: ChatType) => {
      chatStore?.setCurrentChat(chat)
      navigation.navigate(Routers.CHAT, {chatId: chat.id})
    }

    const renderItem = (item: ChatType) => {
      return (
        <TouchableOpacity activeOpacity={0.7} style={styles.chatItem} onPress={() => onChatClick(item)}>
          <View style={styles.iconContainer}>
            <Icon name={'clock-outline'} fill={CoreTheme['text-basic-color']} style={styles.icon} />
          </View>
          <View>
            <Text children={item.title} style={styles.title} />
          </View>
        </TouchableOpacity>
      )
    }

    const renderChats = () => {
      return (
        <FlashList
          renderItem={({item, index}) => renderItem(item)}
          data={chatStore?.chats ?? []}
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={150}
          keyExtractor={(item: ChatType) => String(item.id)}
          overScrollMode={'never'}
        />
      )
    }

    const renderSkeletonItem = () => {
      return (
        <Skeleton>
          <Skeleton.Item height={40} flex={1} borderRadius={15} marginLeft={10} marginRight={10} marginTop={5} />
        </Skeleton>
      )
    }

    const renderSkeletonList = () => {
      const data = [...Array(SKELETON_COUNT)].fill('')
      return (
        <FlashList
          renderItem={() => renderSkeletonItem()}
          data={data}
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={150}
          keyExtractor={(item, index) => String(index)}
          overScrollMode={'never'}
        />
      )
    }

    return (
      <View style={{flexGrow: 1, marginTop: 30}}>
        <Text children={'Недавние чаты'} style={styles.header} />
        {chatStore?.chats ? renderChats() : renderSkeletonList()}
      </View>
    )
  }),
)

export default ChatsListComponents

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    borderRadius: 15,
    width: 150,
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: CoreTheme['shimmer-color'],
    padding: 20,
    marginHorizontal: 5,
  },
  header: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 40,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    //backgroundColor: CoreTheme['shimmer-color'],
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
    //backgroundColor: CoreTheme.white,
    backgroundColor: CoreTheme['shimmer-color'],
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {},
  description: {
    marginTop: 10,
    flexWrap: 'wrap',
  },
  icon: {
    width: 20,
    height: 20,
  },
})
