import { computed, unref } from 'vue'
import { useNamespace } from '@tav-ui/utils/namespace'
import { nanoid } from '@tav-ui/utils/uuid'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { DEFAULT_PERMISSIONQUERY_KEYS, type PermissionQueryContent } from './PermissionQuery/types'

export function createNS(name: string) {
  return useNamespace(name)
}

export function createId(className: string) {
  return `${className}-${nanoid()}`
}

export function normalizedPermissionCodes(codes: string[]) {
  return codes.reduce((result, code) => {
    if (!result[code]) result[code] = code
    return result
  }, {} as Record<string, any>)
}

export function normalizedPermissionQueryContent(content: Record<string, any>) {
  let permissionQueryContent: PermissionQueryContent | undefined

  Object.keys(content).forEach((key: string) => {
    if (!permissionQueryContent) permissionQueryContent = {} as any
    if (DEFAULT_PERMISSIONQUERY_KEYS.includes(key as any)) {
      if (key === DEFAULT_PERMISSIONQUERY_KEYS[1]) {
        ;(permissionQueryContent as any)[key] = normalizedPermissionCodes(content[key])
      } else {
        ;(permissionQueryContent as any)[key] = content[key]
      }
    }
  })

  return permissionQueryContent
}

export function usePermissionMatchedByParent(options: { code: string; ref: any; row?: any }) {
  const { code, ref: vnode, row } = options
  const PermissionParentNames = ['TaPermissionQuery', 'TaPermissionDataQuery']

  function filterVNodeProps(_vnode: any) {
    const filterVNode = unref(_vnode)
    const tableProVNode = (
      filterVNode.instance ? filterVNode.instance._ || filterVNode.instance.$ : {}
    ).parent
    return (
      tableProVNode ??
      filterVNode.parent ??
      filterVNode.__vueParentComponent ??
      filterVNode.$?.parent ??
      null
    )
  }

  function findPermissionParent(__vnode: any): boolean {
    const _vnode = unref(__vnode)
    if (!unref(_vnode)) return false

    if (
      _vnode.type &&
      _vnode.type.name &&
      PermissionParentNames.includes(_vnode.type.name) &&
      _vnode.exposed &&
      _vnode.exposed.permissionContext &&
      _vnode.exposed.permissionContext.permission &&
      (_vnode.exposed.permissionContext.permission.permissionCodes ||
        _vnode.exposed.permissionContext.permission.RECORD_PREMISSION.permissionCodes)
    ) {
      const permissionCodes =
        _vnode.exposed.permissionContext.permission.permissionCodes ||
        _vnode.exposed.permissionContext.permission.RECORD_PREMISSION.permissionCodes

      return !!(Array.isArray(permissionCodes)
        ? permissionCodes.includes(code)
        : permissionCodes[code])
    } else {
      return findPermissionParent(filterVNodeProps(_vnode))
    }
  }

  function findRowPermission(row: any) {
    if (row && row.RECORD_PREMISSION && row.RECORD_PREMISSION.permissionCodes) {
      return row.RECORD_PREMISSION.permissionCodes.includes(code)
    }
    return true
  }

  return computed(() => {
    if (!(code && unref(vnode))) {
      // console.warn('[tavui permission usePermissionMatchedByParent] code、ref is required')
      return false
    }

    const findRowPermissionResult = !!row && findRowPermission(row)
    if (findRowPermissionResult) {
      return true
    } else {
      const findPermissionParentResult = findPermissionParent(filterVNodeProps(vnode))
      if (findPermissionParentResult) {
        return true
      } else {
        const resourceMapPermissions = useGlobalConfig('permissions') as Record<string, any>
        return resourceMapPermissions.value?.[code]?.ifShow ?? false
      }
    }
  })
}
