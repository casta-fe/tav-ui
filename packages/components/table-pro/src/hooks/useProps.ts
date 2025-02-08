// import { deepMerge } from '@tav-ui/utils/basic'
// import { cloneDeep, pick } from 'lodash-es'
import { computed, unref } from 'vue'
import { isFunction, isObject } from '@tav-ui/utils/is'
import { PAGE_SIZE } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProGridEmit, TableProInstance, TableProProps } from '../types'
import type { TableProApiParams, VxeQueryParams } from '../typings'

const DEF = {
  data: {
    result: [],
  },
}

/**
 * 根据 props api 扩展 proxyconfig
 * @param tablePropsRef
 * @returns
 */
function handleExtendProxyConfig(tablePropsRef: ComputedRef<TableProProps>) {
  const { apiSetting, proxyConfig, api } = unref(tablePropsRef)
  const hasApi = api && isFunction(api)
  if (hasApi) {
    const hasApiSetting = Object.keys(apiSetting).length > 0
    const hasProxyConfigProps = proxyConfig?.props && Object.keys(proxyConfig?.props).length > 0
    if (hasApiSetting) {
      const props = {
        list: apiSetting.listField ? `data.${apiSetting.listField}` : 'data',
        result: apiSetting.listField ? `data.${apiSetting.listField}` : 'data',
        total: apiSetting.totalField ? `data.${apiSetting.totalField}` : 'data',
      }
      if (!hasProxyConfigProps) {
        unref(tablePropsRef).proxyConfig = { props }
      }
    }
  }

  return tablePropsRef
}

/**
 * 根据 props api/beforeapi/afterapi 扩展 proxyconfig
 * @param tablePropsRef
 * @param emit
 * @returns
 */
function handleExtendApi(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const { api, beforeApi, afterApi, customActionConfig, apiSetting, permission } =
    unref(tablePropsRef)
  const permissionApi = (permission as any)?.apiPermissionData ?? undefined
  const permissionApiParams = (permission as any)?.apiParams ?? undefined
  const hasApi = (permissionApi && isFunction(permissionApi)) || (api && isFunction(api))
  const hasExportAllApi =
    customActionConfig &&
    customActionConfig.export &&
    isObject(customActionConfig.export) &&
    isFunction(customActionConfig.export.handleAllApi)
  const hasApiSetting = Object.keys(apiSetting).length > 0

  /**  处理 vxetable proxy */
  if (hasApi) {
    // 要使用beforequery则query必须存在
    unref(tablePropsRef).proxyConfig!['ajax'] = {
      query: () => Promise.resolve({}),
    }

    // 缓存api option
    let params: TableProApiParams & { [key: string]: any } = {
      filter: permissionApiParams?.body?.filter ?? {},
      model: permissionApiParams?.body?.model ?? {},
    }
    let result: Record<string, any> = {}

    // 挂载vxetable 导出全部接口
    if (hasExportAllApi) {
      unref(tablePropsRef).proxyConfig!['ajax']!['queryAll'] = async (refParam) => {
        let listField: string | undefined = undefined
        if (hasApiSetting) {
          listField = apiSetting.listField
        }
        if (permissionApi && permissionApiParams) {
          params.filter = { ...(params.body.filter || {}) }
          params.model = { ...(params.body.model || {}) }
        }
        params.model!['viewAll'] = true
        params.model!['modeType'] = refParam?.options?.modeType
        // 郭明说不分页接口返回的就是data数组这里自动包装
        const allApiResult = await (customActionConfig.export as any).handleAllApi(params)
        let data: any[] = []
        if (allApiResult.success) {
          data = allApiResult.data
        }
        let result = {}
        if (listField) {
          result = {
            data: {
              [listField]: data,
            },
          }
        } else {
          result = {
            data,
          }
        }
        return result
      }
    }

    // 关闭自动加载，自动加载使用commit失效
    unref(tablePropsRef).proxyConfig!['autoLoad'] = false

    // 劫持proxy触发beforeapi修改参数
    unref(tablePropsRef).proxyConfig!['beforeQuery'] = async (
      vxeOption: VxeQueryParams,
      option: TableProApiParams
    ) => {
      const {
        page: { currentPage = 1, pageSize = PAGE_SIZE },
      } = vxeOption
      const model = {
        page: currentPage,
        limit: pageSize,
      }

      // model 中的值已vxetable计算的为准，其他值已传入为准，reload 传入 model 后，要对vxetable的model进行合并
      params = option
        ? option.model
          ? { ...option, ...{ model: { ...model, ...option.model } }, ...option.model }
          : { ...option, ...{ model } }
        : { ...(params?.body ?? params), ...{ model } }

      try {
        if (beforeApi && isFunction(beforeApi)) {
          params = (await beforeApi(params)) || params
        }

        let _api = api

        if (permissionApi && permissionApiParams) {
          _api = permissionApi
          params = {
            ...permissionApiParams,
            ...((params.filter ?? {}) && (params.model ?? {})
              ? {
                  body: {
                    filter: params.filter ?? {},
                    model: params.model ?? {},
                  },
                }
              : {}),
          }
        }

        if (_api && isFunction(_api)) {
          // eslint-disable-next-line no-console
          console.log('hijack table pro api 😂')

          const apiResult = await _api(params)

          if (apiResult.data && apiResult.success) {
            result = apiResult

            if (afterApi && isFunction(afterApi)) {
              result = (await afterApi(result)) || result
            }
          } else {
            result = DEF
          }
        } else {
          result = DEF
        }

        emit('ApiSuccess', {
          ...result,
        })

        // // 阻断 vue 对大数组的监听，避免 vue 绑定大数据造成短暂的卡顿, => 虚拟滚动-最大高度demo
        // unref(tableRef)?.loadData(result)
        return Promise.resolve(result)
      } catch (error) {
        emit('ApiError', error)
        return Promise.resolve(DEF)
      }
    }
  }

  return tablePropsRef
}

/**
 * 根据传入的 props 利用 vxetable 现有方法实现扩展的 props
 * @param tablePropsRef
 * @param tableRef
 * @param emit
 * @returns
 */
function handleExtendProps(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const handleExtendProxyConfigResult = handleExtendProxyConfig(tablePropsRef)
  const handleExtendApiResult = handleExtendApi(handleExtendProxyConfigResult, tableRef, emit)
  return handleExtendApiResult
}

/**
 * 根据 fixedLineHeight 做行高处理
 * @param tablePropsRef \
 */
function handleRowLineHeight(tablePropsRef: ComputedRef<TableProProps>) {
  const { fixedLineHeight } = unref(tablePropsRef)
  // 因为 vxetable 虚拟滚动的要求是关闭动态行高（即行高度不允许被内容撑开）
  if (fixedLineHeight) {
    // 所以当 showTooltip 为 true 时，要设置固定行高度（即设置 showOverflow）
    unref(tablePropsRef).showOverflow = 'ellipsis'
    unref(tablePropsRef).showHeaderOverflow = 'ellipsis'
    unref(tablePropsRef).showFooterOverflow = 'ellipsis'
    unref(tablePropsRef).scrollX.enabled = true
    unref(tablePropsRef).scrollY.enabled = true
  } else {
    // 所以当 showTooltip 为 false 时，不设置固定行高度，行高度由内容撑开（虚拟滚动失效）
    unref(tablePropsRef).showOverflow = null
    unref(tablePropsRef).showHeaderOverflow = null
    unref(tablePropsRef).showFooterOverflow = null
    unref(tablePropsRef).scrollX.enabled = false
    unref(tablePropsRef).scrollY.enabled = false
  }

  return tablePropsRef
}

/**
 * 利用生成的默认 props 与 传入的 props 合并
 * @param defaultPropsRef
 * @param paramPropsRef
 * @returns
 */
function mergePropsRef(
  defaultPropsRef: ComputedRef<Partial<TableProProps>>,
  paramPropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
): ComputedRef<TableProProps> {
  return computed(() => {
    for (const [key] of Object.entries(unref(paramPropsRef))) {
      //@ts-ignore
      if (unref(defaultPropsRef)[key]) {
        // 只对对象进行合并，其他类型已传入的值为准
        //@ts-ignore
        if (isObject(unref(defaultPropsRef)[key])) {
          // // 会有性能问题，暂时浅合并
          // unref(paramPropsRef)[key] = deepMerge(
          //   cloneDeep(unref(defaultPropsRef)[key]),
          //   cloneDeep(unref(paramPropsRef)[key])
          // )
          // 浅合并
          //@ts-ignore
          unref(paramPropsRef)[key] = {
            //@ts-ignore
            ...unref(defaultPropsRef)[key],
            //@ts-ignore
            ...unref(paramPropsRef)[key],
          }
        }
      }
    }
    const handledRowLineHeightTablePropsRef = handleRowLineHeight(paramPropsRef)
    const tablePropsRef = handleExtendProps(handledRowLineHeightTablePropsRef, tableRef, emit)
    return { ...unref(tablePropsRef) }
  })
}

/**
 * 利用 types 中声明的 tableproprops 来生成默认props
 * @param defaultProps
 * @returns
 */
function createDefaultPropsRef(defaultProps: TableProProps): ComputedRef<Partial<TableProProps>> {
  const _defaultProps: Partial<TableProProps> = {}

  for (const [key, value] of Object.entries(defaultProps)) {
    const defaultValue = (value as any).default
    if (defaultValue) {
      // 这里指判断了有对象默认值的情况，函数默认值需要做判断
      //@ts-ignore
      _defaultProps[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  }

  return computed(() => ({ ..._defaultProps }))
}

export function useProps(
  tableProProps: any,
  paramPropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const defaultPropsRef = createDefaultPropsRef(tableProProps)
  const tablePropsRef = mergePropsRef(defaultPropsRef, paramPropsRef, tableRef, emit)
  return tablePropsRef
}
