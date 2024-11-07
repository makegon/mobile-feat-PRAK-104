import {useEffect, useState} from 'react'
import {adapty} from 'react-native-adapty'

export const useAdaptyListener = () => {
  const [premiumIsActive, setPremiumIsActive] = useState(false)
  useEffect(() => {
    const adaptyListener = adapty.addEventListener('onLatestProfileLoad', profile => {
      const isActive = profile?.accessLevels ? profile?.accessLevels['premium']?.isActive : false

      setPremiumIsActive(isActive)
    })

    return () => {
      adaptyListener.remove()
    }
  }, [])

  return premiumIsActive
}
