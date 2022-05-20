import { withInstall } from '@tav-ui/utils/with-install'
import CountDownButton from './src/count-down-button.vue'
import CountDown from './src/count-down.vue'
import CountDownInput from './src/count-down-input.vue'

const TaCountDown = withInstall(CountDown)
const TaCountDownButton = withInstall(CountDownButton)
const TaCountDownInput = withInstall(CountDownInput)

export * from './src/types'
export { TaCountDown, TaCountDownButton, TaCountDownInput }
export default TaCountDown
