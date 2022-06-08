import { withInstall } from '@tav-ui/utils/with-install'
import TablePro from './src/table-pro'
import TableProTags from './src/components/tags'
import TableProAction from './src/components/action'
const TaTablePro = withInstall(TablePro)
const TaTableProTags = withInstall(TableProTags)
const TaTableProAction = withInstall(TableProAction)
export * from './src/setup'
export { TaTablePro, TaTableProTags, TaTableProAction }
export * from './src/types'
export * from './src/typings'
export * from './src/vxe-events'
export * from './src/vxe-props-config'
export default TaTablePro