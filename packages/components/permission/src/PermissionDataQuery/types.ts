import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { type ApiPermissionDataParams } from '../types'
import { permissionApiProps } from '../global-config-types'

export type PermissionQueryDataContent = Record<string, any>
export const permissionDataQueryProps = {
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

export type PermissionDataQueryProps = ExtractPropTypes<typeof permissionDataQueryProps>

export const permissionDataQueryEmits = {
  apiSuccess: (...args: [PermissionQueryDataContent]) => args instanceof Object,
}

export type PermissionDataQueryEmits = typeof permissionDataQueryEmits
