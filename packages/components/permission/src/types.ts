import { type PermissionApiProps } from './global-config-types'
import { type PermissionQueryContent } from './PermissionQuery/types'
import { type PermissionQueryDataContent } from './PermissionDataQuery/types'

export interface ApiPermissionParams {
  /** appid，必传不能为空 */
  appId: number | string
  /** 父code，必传不能为空 */
  code: string
  /** 子code数组，非必传 */
  subCodes?: string[]
  /** 文件方案对应的应用id，可以不传，如果不传就取appId */
  fileSchemeTargetAppId?: number
}

export interface ApiPermissionResponse {
  appId: number | string
  recordkeyName?: string
  recordKeyValue?: string
  permissionCodes?: string[]
  fileTypeCodes?: string[]
}

export interface ApiPermissionDataParams extends ApiPermissionParams {
  /** 父code对应的接口地址，可以如果resource上有参数，则必传，而且必须填充好 */
  resource?: string
  /** 如数据接口有参数则必传 */
  body?: Record<string, any>
  /** 数据唯一标识的名称，可以不传，默认为 id */
  recordkeyName?: string
}

export interface PermissionsContext {
  id: string
  type: string
  disabled?: boolean
  getPermission: (id: string) => PermissionContext | undefined
  addPermission: (permissionItem: PermissionContext) => void
  removePermission: (permissionItem: PermissionContext) => void
}

export interface PermissionContext {
  id: string
  type: string
  disabled?: boolean
  permission?:
    | PermissionQueryContent
    | PermissionQueryDataContent
    | {
        apiParams: ApiPermissionParams | ApiPermissionDataParams
        apiPermission?: PermissionApiProps['apiPermission']
        apiPermissionData?: PermissionApiProps['apiPermissionData']
      }
}
