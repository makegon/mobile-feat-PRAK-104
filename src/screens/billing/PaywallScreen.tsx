import {useAdaptyPaywall} from '../../utils/hooks/adaptyhooks/useAdaptyPaywall.ts'
import {useEffect} from 'react'
import {adapty} from 'react-native-adapty'

export const PaywallScreen = () => {
  useEffect(() => {
    (async () => {
      console.log(`PaywallScreen adapty.isActivated() => ${await adapty.isActivated()}`)
    })()
  }, [])

  const paywallView = useAdaptyPaywall()

  // const paywallListeners = paywallView?.registerEventHandlers({
  //   onCloseButtonPress() {
  //     return true
  //   },
  //   onPurchaseCompleted(profile) {
  //     return true
  //   },
  //   onPurchaseStarted(product) {
  //     /***/
  //   },
  //   onPurchaseCancelled(product) {
  //     /***/
  //   },
  //   onPurchaseFailed(error) {
  //     /***/
  //   },
  //   onRestoreCompleted(profile) {
  //     /***/
  //   },
  //   onRestoreFailed(error) {
  //     /***/
  //   },
  //   onProductSelected() {
  //     /***/
  //   },
  //   onRenderingFailed(error) {
  //     /***/
  //   },
  //   onLoadingProductsFailed(error) {
  //     /***/
  //   },
  //   onUrlPress(url) {
  //     /* handle url */
  //   },
  // })

  return <>{paywallView ? paywallView.present() : <></>}</>
}
