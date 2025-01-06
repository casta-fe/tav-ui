import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { permissionApiProps } from '../global-config-types'
import { type ApiPermissionDataParams } from '../types'

export const tablePermissionDataQueryProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  apiParams: {
    type: Object as PropType<ApiPermissionDataParams>,
  },
  ...omit(permissionApiProps, 'apiPermission'),
}

export type TablePermissionDataQueryProps = ExtractPropTypes<typeof tablePermissionDataQueryProps>
