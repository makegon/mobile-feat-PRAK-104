import {inject, observer} from 'mobx-react'
import React, {useCallback, useEffect} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {FlashList} from '@shopify/flash-list'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from 'react-native-screens/native-stack'
import {Routers} from '../../navigation/Routes.ts'
import {TPromptStore} from '../../stores/PromptStore.ts'
import {PromptType} from '../../common/types/PromptType.ts'
import {Icon} from '@ui-kitten/components'
// @ts-ignore
import Skeleton from '@thevsstech/react-native-skeleton'

interface IProps {
  promptStore?: TPromptStore
}

export const SKELETON_COUNT = 3

const PromptsListComponents = inject('promptStore')(
  observer(({promptStore}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
      console.log(`chats ${promptStore?.categoriesWithPromptArray?.length}`)
    }, [promptStore?.categoriesWithPromptArray])

    const onPromptClick = (prompt: PromptType) => {
      navigation.navigate(Routers.CHAT, {promptId: prompt.id})
    }

    const renderPromptsItem = useCallback(
      ({item, index}: {item: PromptType; index: number}) => {
        return (
          <TouchableOpacity key={`${item.id}${index}`} activeOpacity={0.7} onPress={() => onPromptClick(item)} style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'} children={`${item.name}`} />
              {item.categoryName && <Text style={styles.categoryName} numberOfLines={2} ellipsizeMode={'tail'} children={item.categoryName} />}
            </View>
            {item.icon ? (
              <View style={styles.iconContainer}>
                <Icon name={item.icon} fill={CoreTheme['text-basic-color']} style={styles.icon} />
              </View>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        )
      },
      [promptStore?.categoriesWithPromptArray],
    )

    const renderItem = (item: PromptType, index: number) => {
      return renderPromptsItem({item, index})
    }

    const renderPrompts = () => {
      return (
        <FlashList
          renderItem={({item, index}) => renderItem(item, index)}
          data={promptStore?.allPrompts ?? []}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={150}
          keyExtractor={(item: PromptType) => String(item.id)}
          overScrollMode={'never'}
        />
      )
    }

    const renderSkeletonItem = () => (
      <Skeleton>
        <Skeleton.Item width={150} height={150} borderRadius={15} marginLeft={5} />
      </Skeleton>
    )

    const renderSkeletonList = () => {
      const data = [...Array(SKELETON_COUNT)].fill('')
      return (
        <FlashList
          renderItem={() => renderSkeletonItem()}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={150}
          keyExtractor={(item, index) => String(index)}
          overScrollMode={'never'}
        />
      )
    }

    return <View style={{height: 150, paddingHorizontal: 5}}>{promptStore?.isLoadPrompts ? renderSkeletonList() : renderPrompts()}</View>
  }),
)

export default PromptsListComponents

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    borderRadius: 15,
    width: 150,
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: CoreTheme['prompt-background'],
    padding: 20,
    marginHorizontal: 5,
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
    backgroundColor: CoreTheme.white,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    color: CoreTheme['text-basic-color'],
  },
  categoryName: {
    marginTop: 10,
    flexWrap: 'wrap',
    color: CoreTheme['disable-color']
  },
  icon: {
    width: 24,
    height: 24,
  },
})
