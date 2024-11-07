import {ActionItemType} from '../../common/types/ActionItemType.ts'
import {useMemo} from 'react'
import {CoreTheme} from '../../common/ui-kitten/theme.ts'
import {Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'

interface IProps {
  headerText?: string
  descriptionText?: string
  actionSheetVisible: boolean
  actionItems: ActionItemType[]
  onCancel: () => void
  cancelText: string
}

export const PraktikaActionSheet = ({headerText, descriptionText, actionItems, actionSheetVisible, onCancel, cancelText}: IProps) => {
  const actionSheetItems = useMemo(
    () => [
      ...actionItems,
      {
        id: '#cancel' as const,
        label: cancelText,
        onPress: onCancel,
      },
    ],
    [actionItems, cancelText, onCancel],
  )

  return (
    <Modal visible={actionSheetVisible} onRequestClose={onCancel} transparent>
      <StatusBar animated barStyle={'dark-content'} translucent backgroundColor={CoreTheme['background-color']} />
      <TouchableOpacity activeOpacity={0.5} onPressOut={onCancel} style={styles.background}>
        <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} overScrollMode={'never'}>
              {(!!headerText || !!descriptionText) && (
                <TouchableWithoutFeedback>
                  <View style={styles.headerContainer}>
                    {!!headerText && <Text style={styles.headerText}>{headerText}</Text>}
                    {!!descriptionText && <Text style={styles.descriptionText}>{descriptionText}</Text>}
                  </View>
                </TouchableWithoutFeedback>
              )}
              {actionSheetItems.map((actionItem, index) => (
                <TouchableHighlight
                  key={`${actionItem.label}${index}`}
                  underlayColor={CoreTheme['color-primary']}
                  style={[styles.actionSheetView, index > 0 && index < actionSheetItems.length - 1 && {marginTop: 10}, index === actionSheetItems.length - 1 && {marginTop: 20}]}
                  onPress={actionItem.onPress}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {actionItem.icon}
                    <Text allowFontScaling={false} style={[styles.actionSheetText, index === actionSheetItems.length - 1 && styles.redText]}>
                      {actionItem.label}
                    </Text>
                  </View>
                </TouchableHighlight>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: CoreTheme['background-color'],
    paddingVertical: 24,
  },
  headerContainer: {
    paddingBottom: 16,
  },
  actionSheetText: {
    fontSize: 15,
    color: CoreTheme['text-basic-color'],
    flexWrap: 'wrap',
    marginHorizontal: 10,
    textAlign: 'center',
    paddingVertical: 16,
  },
  actionSheetView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: CoreTheme.white,
  },
  headerText: {
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 16,
  },
  descriptionText: {
    color: CoreTheme['placeholder-color'],
    lineHeight: 18,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  redText: {
    color: CoreTheme['color-danger-700'],
  },
})
