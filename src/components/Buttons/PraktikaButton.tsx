import {Button, ButtonProps} from '@ui-kitten/components'
import {useState} from 'react'
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes'
import {ButtonLoader} from '../Loaders/ButtonLoader.tsx'

interface IProps extends ButtonProps {
  isLoading?: boolean
}

export const PraktikaButton = (props: IProps) => {
  const [isThrottle, setIsThrottle] = useState(false)

  const throttle = () => {
    if (!isThrottle) {
      setIsThrottle(true)
      setTimeout(() => {
        setIsThrottle(false)
      }, 500)
    }
  }

  const renderChildren = () => {
    return props.isLoading ? <ButtonLoader /> : props.children
  }

  const onPress = (event: GestureResponderEvent) => {
    if (isThrottle) {
      return
    } else if (props.onPress) {
      props.onPress(event)
      throttle()
    }
  }

  return (
    <Button
      {...props}
      onPress={event => onPress(event)}
      accessoryLeft={props.isLoading ? undefined : props.accessoryLeft}
      disabled={isThrottle || props?.disabled || props?.isLoading}
      children={renderChildren()}
    />
  )
}
