import {inject, observer} from 'mobx-react'
import {TGptStore} from '../../stores/GptStore.ts'
import {StyleSheet, View} from 'react-native'
import {IndexPath, Select, SelectItem} from '@ui-kitten/components'
import {useEffect, useState} from 'react'
import {TUserStore} from '../../stores/UserStore.ts'

interface IProps {
  gptStore?: TGptStore
  userStore?: TUserStore
}

const ChooseGptModelComponent = inject(
  'gptStore',
  'userStore',
)(
  observer(({gptStore, userStore}: IProps) => {
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0))

    useEffect(() => {
      gptStore?.getGptModels()
    }, [])

    // useEffect(() => {
    //   if (userStore?.currentUser?.selected_model_id) {
    //       console.log('selected_model_id', userStore?.currentUser?.selected_model_id)
    //     const modelIndex = gptStore?.gptModels?.findIndex(model => model.id === userStore?.currentUser?.selected_model_id)
    //       console.log('modelIndex', modelIndex)
    //     setSelectedIndex(new IndexPath(modelIndex ?? 0))
    //   }
    // }, [])

    const onSelect = (index: IndexPath | IndexPath[]) => {
      if (Array.isArray(index)) {
        return
      } else {
        console.log('onSelect', index)
        setSelectedIndex(index)
        gptStore?.setSelectedModel(index)
      }
    }

    return (
      <View style={styles.container}>
        <Select selectedIndex={selectedIndex} status={'basic'} onSelect={onSelect} value={gptStore?.selectedModel?.name}>
          {gptStore?.gptModels?.map((model, index) => <SelectItem title={model.name} key={index + model.name} />)}
        </Select>
      </View>
    )
  }),
)

export default ChooseGptModelComponent

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 10,
  },
})
