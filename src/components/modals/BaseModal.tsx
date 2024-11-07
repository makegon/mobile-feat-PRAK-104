import React from 'react'
import {KeyboardAvoidingView, Modal, StyleSheet, View} from 'react-native'

interface UniversalModalProps {
  visible: boolean
  children: React.ReactNode
}

export const BaseModalComponent = ({visible, children}: UniversalModalProps) => {
  console.log('123')
  return (
    <Modal visible={true} transparent>
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={-60} style={styles.container}>
        <View style={styles.childrenContainer}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  childrenContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    display: 'flex',
    borderRadius: 15,
  },
})
