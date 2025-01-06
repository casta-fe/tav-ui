import type { InjectionKey } from 'vue'
import type { PermissionContext, PermissionsContext } from './types'

export const permissionsContextKey: InjectionKey<PermissionsContext> =
  Symbol('permissionsContextKey')
export const permissionContextKey: InjectionKey<PermissionContext> = Symbol('permissionContextKey')

export const DEFAULT_APIPARAMS = {
  recordkeyName: 'id',
}
