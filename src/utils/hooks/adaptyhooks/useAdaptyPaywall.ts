import {useEffect, useState} from 'react'
import {adapty, AdaptyPaywall} from 'react-native-adapty'
// import {createPaywallView} from '@adapty/react-native-ui'
import * as AdaptyUI from '@adapty/react-native-ui'
import {ViewController} from '@adapty/react-native-ui/dist/view-controller'

export const useAdaptyPaywall = () => {
  const [paywall, setPaywall] = useState<AdaptyPaywall | undefined>(undefined)
  const [paywallView, setPaywallView] = useState<ViewController | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      try {
        const adaptyPaywall = await adapty.getPaywall(process.env.ADAPTY_PLACEMENT_ID ?? 'membership_paywall', 'en')
        console.log(`adaptyPaywall ${JSON.stringify(adaptyPaywall)}`)
        setPaywall(adaptyPaywall)
        console.log(`paywall ${JSON.stringify(paywall)}`)
        if (paywall) {
          const paywallView = await AdaptyUI.createPaywallView(adaptyPaywall)
          console.log(`paywallView ${JSON.stringify(paywallView)}`)
          setPaywallView(paywallView)
        }
      } catch (e) {
        console.log(`useAdaptyPaywall error ${JSON.stringify(e)}`)
      }
    })()
  }, [])

  return paywallView
}
