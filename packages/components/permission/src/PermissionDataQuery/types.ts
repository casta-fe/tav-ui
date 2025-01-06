import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { type ApiPermissionParams } from '../types'
import { permissionApiProps } from '../global-config-types'

export type PermissionQueryDataContent = Record<string, any>
export const permissionDataQueryProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  apiParams: {
    type: Object as PropType<ApiPermissionParams>,
  },
  permission: {
    type: Object,
  },
  ...omit(permissionApiProps, 'apiPermission'),
}

export type PermissionDataQueryProps = ExtractPropTypes<typeof permissionDataQueryProps>
