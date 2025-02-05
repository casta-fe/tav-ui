import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { type ApiPermissionDataParams } from '../types'
import { permissionApiProps } from '../global-config-types'

export const tablePermissionDataQueryProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  apiParams: {
    type: Object as PropType<ApiPermissionDataParams>,
  },
  permission: {
    type: Object,
  },
  ...omit(permissionApiProps, 'apiPermission'),
  immediate: {
    type: Boolean,
    default: true,
  },
}

export type TablePermissionDataQueryProps = ExtractPropTypes<typeof tablePermissionDataQueryProps>
