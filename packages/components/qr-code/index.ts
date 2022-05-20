import { withInstall } from '@tav-ui/utils/with-install'
import Qrcode from './src/qr-code.vue'
const TaQrCode = withInstall(Qrcode)
export * from './src/types'
export { TaQrCode }
export default TaQrCode
