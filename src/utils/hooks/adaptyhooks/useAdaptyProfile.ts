import {useEffect, useState} from 'react'
import {adapty, AdaptyProfile} from 'react-native-adapty'

export const useAdaptyProfile = () => {
  const [adaptyProfile, setAdaptyProfile] = useState<AdaptyProfile | null>(null)

  useEffect(() => {
    ;async () => {
      const profile = await adapty.getProfile()
      setAdaptyProfile(profile)
    }
  }, [])

  return adaptyProfile
}
