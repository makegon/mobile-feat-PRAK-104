import {ActivityIndicator, StyleSheet, View} from 'react-native'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'

export const ChatLoader = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color={CoreTheme['color-primary']} />
  </View>
)

const styles = StyleSheet.create({
  loader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    zIndex: 100000,
    width: '100%',
    height: '100%',
  },
})
