import { withInstall } from '@tav-ui/utils/with-install'
import Drawer from './src/drawer.vue'
const TaDrawer = withInstall(Drawer)
export * from './src/typing'
export { useDrawer, useDrawerInner } from './src/useDrawer'
export { TaDrawer }
export default TaDrawer
