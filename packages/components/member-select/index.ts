import { withInstall } from '@tav-ui/utils/with-install'
import MemberSelect from './src/member-select.vue'
const TaMemberSelect = withInstall(MemberSelect)
export * from './src/types'
export { TaMemberSelect }
export default TaMemberSelect
