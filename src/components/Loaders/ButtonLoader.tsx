import {Spinner} from '@ui-kitten/components'
import {View} from 'react-native'

export const ButtonLoader = () => (
  <View>
    <Spinner status={'primary'} />
  </View>
)
