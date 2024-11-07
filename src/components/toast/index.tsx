import {Text} from '@ui-kitten/components'
import {TToastStore} from '../../stores/ToastStore.ts'
import {inject, observer} from 'mobx-react'
import {StyleSheet, View} from 'react-native'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'

interface IProps {
  toastStore?: TToastStore
}

export const ToastMessage = inject('toastStore')(
  observer(({toastStore}: IProps) => {
    return toastStore?.toastMessage.message ? (
      <View style={{...styles.errorContainer}}>
        <Text style={{...styles.errorText}} children={toastStore?.toastMessage.message} />
      </View>
    ) : (
      <></>
    )
  }),
)

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    alignSelf: 'center',
    width: '93%',
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    zIndex: 10000,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 13,
    color: CoreTheme.white,
  },
})
