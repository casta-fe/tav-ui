import { withInstall } from '@tav-ui/utils/with-install'
import CountDownButton from './src/count-down-button.vue'
import CountDown from './src/count-down.vue'
const TaCountDown = withInstall(CountDown)
const TaCountDownButton = withInstall(CountDownButton)
export * from './src/types'
export { TaCountDown, TaCountDownButton }
export default TaCountDown
