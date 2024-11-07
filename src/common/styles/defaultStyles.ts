import {StyleSheet} from 'react-native'
import {CoreTheme} from '../ui-kitten/theme.ts'

export const defaultStyles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flex: 1,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
    color: CoreTheme['text-basic-color'],
  },
  icon: {
    width: 28,
    height: 28,
  },
})
