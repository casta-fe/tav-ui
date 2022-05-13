import { withInstall } from '@tav-ui/utils/with-install'
import ConfigProvider from './src/config-provider'
const TaConfigProvider = withInstall(ConfigProvider)
export * from './src/types'
export { TaConfigProvider }
export default TaConfigProvider
