import React from 'react'
import {Icon, Input, TextProps} from '@ui-kitten/components'
import {Pressable, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {RenderProp} from '@ui-kitten/components/devsupport'
import {PasswordValidateType} from '../../common/types/UserType.ts'

interface IProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  isValid: PasswordValidateType | undefined
  toggleSecure: () => void
  secureTextEntry: boolean
  renderCaption: RenderProp<TextProps>
}

export const PasswordInput = ({placeholder, value, onChangeText, isValid, toggleSecure, secureTextEntry, renderCaption}: IProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      status={'basic'}
      size={'large'}
      caption={renderCaption}
      style={{
        ...styles.input,
        ...(!isValid?.isValid ? {borderColor: 'red', marginBottom: 2} : {marginBottom: 20}),
      }}
      secureTextEntry={secureTextEntry}
      accessoryRight={props => (
        <Pressable onPress={toggleSecure}>
          <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
})
