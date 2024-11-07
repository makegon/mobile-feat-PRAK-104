import {inject, observer} from 'mobx-react'
import {TPhotoStore} from '../../stores/PhotoStore.ts'
import {TChatStore} from '../../stores/ChatStore.ts'
import {Image, StyleSheet, View} from 'react-native'
import {Input} from '@ui-kitten/components'
import {Button as KittenButton} from '@ui-kitten/components/ui/button/button.component'
import React, {useEffect} from 'react'
import {ResponseMessageTypes} from '../../common/enums.ts'

interface IProps {
  photoStore?: TPhotoStore
  chatStore?: TChatStore
  onCancel: () => void
  onSend: () => void
}

export const PhotoMessageModal = inject(
  'photoStore',
  'chatStore',
)(
  observer(({photoStore, chatStore, onSend, onCancel}: IProps) => {
    useEffect(() => {
      console.log('Photo modal::::', photoStore?.selectedPhoto?.uri)
    }, [photoStore?.selectedPhoto])

    console.log(!!photoStore?.selectedPhoto)

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: photoStore?.selectedPhoto?.uri}} />
        <View>
          <Input
            style={styles.modalInput}
            placeholder={'Добавить подпись...'}
            value={chatStore?.newModalMessage ?? ''}
            size={'medium'}
            multiline
            onChangeText={text => chatStore?.changeMessageText(text, ResponseMessageTypes.IMAGE)}
          />
          <View style={styles.buttonContainer}>
            <KittenButton style={styles.button} appearance={'ghost'} children={'Отмена'} onPress={onCancel} />
            <KittenButton style={styles.button} appearance={'ghost'} children={'Отправить'} onPress={onSend} />
          </View>
        </View>
      </View>
    )
  }),
)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  modalInput: {},
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {},
})
