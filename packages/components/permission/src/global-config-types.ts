import { type ExtractPropTypes, type PropType } from 'vue'
import { omit } from 'lodash-es'
import { type ApiPermissionDataParams, type ApiPermissionParams } from './types'

export const permissionApiProps = {
  /** 对应 permission/query/queryPermission，注意这里传入的 code 类型必为 permissiongroup */
  apiPermission: {
    type: Function as PropType<(params: ApiPermissionParams) => Promise<any>>,
  },
  /** 对应 permission/query/queryPermissionData，注意这里传入的 code 类型必为 permissionfilter */
  apiPermissionData: {
    type: Function as PropType<(params: ApiPermissionDataParams) => Promise<any>>,
  },
}

export type PermissionApiProps = ExtractPropTypes<typeof permissionApiProps>

export const globalConfigFileProps = {
  /**根据子组件名来划分注入数据 */
  TaPermissionQuery: {
    ...omit(permissionApiProps, 'apiPermissionData'),
  },
  TaPermissionDataQuery: {
    ...omit(permissionApiProps, 'apiPermission'),
  },
  TaTablePermissionDataQuery: {
    ...omit(permissionApiProps, 'apiPermission'),
  },
}

export type GlobalConfigFileProps = ExtractPropTypes<typeof globalConfigFileProps>
