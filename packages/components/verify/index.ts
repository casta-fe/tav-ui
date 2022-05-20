import { withInstall } from '@tav-ui/utils/with-install'
import Rotate from './src/rotate'
import Verify from './src/verify'
const TaVerify = withInstall(Verify)
const TaVerifyRotate = withInstall(Rotate)
export * from './src/types'
export { TaVerify, TaVerifyRotate }
export default TaVerify
