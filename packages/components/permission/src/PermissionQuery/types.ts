import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { type ApiPermissionParams } from '../types'
import { permissionApiProps } from '../global-config-types'
import type { ApiPermissionResponse } from '../types'

export const DEFAULT_PERMISSIONQUERY_KEYS = ['fileTypeCodes', 'permissionCodes'] as const
export type PermissionQueryContent = Record<typeof DEFAULT_PERMISSIONQUERY_KEYS[number], any>

export const permissionQueryProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  apiParams: {
    type: Object as PropType<ApiPermissionParams>,
  },
  permission: {
    type: Object as PropType<ApiPermissionResponse>,
  },
  ...omit(permissionApiProps, 'apiPermissionData'),
}

export type PermissionQueryProps = ExtractPropTypes<typeof permissionQueryProps>
