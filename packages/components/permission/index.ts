import { withInstall } from '@tav-ui/utils/with-install'
import PermissionFragment from './src/PermissionFragment/index.vue'
import Permissions from './src/Permissions/index.vue'
import PermissionQuery from './src/PermissionQuery/index.vue'
import PermissionDataQuery from './src/PermissionDataQuery/index.vue'
import TablePermissionDataQuery from './src/TablePermissionDataQuery/index.vue'

export const TaPermissionFragment = withInstall(PermissionFragment)
export const TaPermissions = withInstall(Permissions)
export const TaPermissionQuery = withInstall(PermissionQuery)
export const TaPermissionDataQuery = withInstall(PermissionDataQuery)
export const TaTablePermissionDataQuery = withInstall(TablePermissionDataQuery)
export * from './src/types'
export { usePermissionMatchedByParent } from './src/utils'
