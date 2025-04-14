// import { deepMerge } from '@tav-ui/utils/basic'
// import { cloneDeep, pick } from 'lodash-es'
import { computed, unref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { isFunction, isObject } from '@tav-ui/utils/is'
import { PAGE_SIZE } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProGridEmit, TableProInstance, TableProProps } from '../types'
import type { TableProApiParams, VxeQueryParams } from '../typings'
import type { Emitter } from '@tav-ui/utils/mitt'

const DEF = {
  data: {
    result: [],
  },
}

function getPropByPath(obj: Record<string, any>, path: string, strict = false) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        console.log(`please transfer a valid prop path to form item!`)
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
  }
}

function deepSet(obj: any, path: string, val: any) {
  //@ts-ignore
  path = path.replaceAll('[', '.[')
  const keys = path.split('.')

  for (let i = 0; i < keys.length; i++) {
    let currentKey = keys[i] as any
    let nextKey = keys[i + 1] as any
    if (currentKey.includes('[')) {
      currentKey = parseInt(currentKey.substring(1, currentKey.length - 1))
    }
    if (nextKey && nextKey.includes('[')) {
      nextKey = parseInt(nextKey.substring(1, nextKey.length - 1))
    }

    if (typeof nextKey !== 'undefined') {
      obj[currentKey] = obj[currentKey] ? obj[currentKey] : isNaN(nextKey) ? {} : []
    } else {
      obj[currentKey] = val
    }

    obj = obj[currentKey]
  }
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
  emit: TableProGridEmit,
  tableEmitter: Emitter
) {
  const { api, beforeApi, afterApi, customActionConfig, apiSetting, permission, apiType } =
    unref(tablePropsRef)
  const permissionApi = (permission as any)?.apiPermissionData ?? undefined
  const permissionApiParams = (permission as any)?.apiParams ?? undefined
  const hasApi = (permissionApi && isFunction(permissionApi)) || (api && isFunction(api))
  const hasExportAllApi =
    customActionConfig && customActionConfig.export && isObject(customActionConfig.export)

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
        const keepedApiParamKeys = (customActionConfig.export as any).keepedApiParamKeys ?? []
        const isPermissionApi = permissionApi && permissionApiParams
        let _api = api
        if (isPermissionApi) {
          _api = permissionApi
          params = {
            ...permissionApiParams,
            ...((params.body?.filter ?? params.filter) && (params.body?.model ?? params.model)
              ? {
                  body:
                    apiType === 'list'
                      ? {
                          ...(params.body?.filter ?? params.filter ?? {}),
                          ...{
                            ...(params.body?.model ?? params.model ?? {}),
                            viewAll: true,
                            modeType: refParam?.options?.modeType,
                          },
                        }
                      : {
                          filter: params.body?.filter ?? params.filter ?? {},
                          model: {
                            ...(params.body?.model ?? params.model ?? {}),
                            viewAll: true,
                            modeType: refParam?.options?.modeType,
                          },
                        },
                }
              : {}),
          }
        } else {
          if (apiType === 'list') {
            params = {
              ...params,
              ...(params.model
                ? {
                    model: {
                      ...params.model,
                      viewAll: true,
                      modeType: refParam?.options?.modeType,
                    },
                  }
                : {
                    viewAll: true,
                    modeType: refParam?.options?.modeType,
                  }),
            }
          } else {
            params = {
              filter: params.filter ?? {},
              model: {
                ...(params.model ?? {}),
                viewAll: true,
                modeType: refParam?.options?.modeType,
              },
            }
          }
        }
        const allParamsFilter: Record<string, any> = {}

        if ((params.body?.model ?? params.model ?? params)!['modeType'] === 'all') {
          keepedApiParamKeys.length &&
            keepedApiParamKeys.forEach((key: string) => {
              const { v } = getPropByPath(params, key)
              if (v) {
                deepSet(allParamsFilter, key, v)
              }
            })
        }

        let exportResult: Record<string, any> = {}
        const apiResult = await _api?.(
          (params.body?.model ?? params.model ?? params)!['modeType'] === 'all'
            ? params.body
              ? {
                  ...allParamsFilter,
                  body: {
                    filter: allParamsFilter.body?.filter ?? {},
                    model: params.body.model,
                  },
                }
              : params.filter || params.model
              ? {
                  filter: allParamsFilter.filter ?? {},
                  model: params.model ?? {},
                }
              : params
            : params
        )
        if (apiResult.data && apiResult.success) {
          exportResult = apiResult

          if (
            (customActionConfig.export as any).afterApi &&
            isFunction((customActionConfig.export as any).afterApi)
          ) {
            exportResult =
              (await (customActionConfig.export as any).afterApi(apiResult)) || exportResult
          }

          // list 数据这里自动转换
          if (apiType === 'list') {
            exportResult = {
              data: {
                [apiSetting.listField!]: exportResult.data,
                [apiSetting.totalField!]: exportResult.data.length,
              },
            }
          }
        }

        return exportResult
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

        // 跟 @hyb 商量后只对 permission api 做 list 参数兼容，对于普通 api 参数还是沿用之前分页的数据结构，这样做单纯是为了兼容，因为投管/其他项目里用的地方很多改起来太费劲
        if (permissionApi && permissionApiParams) {
          _api = permissionApi
          params = {
            ...permissionApiParams,
            ...((params.filter ?? {}) && (params.model ?? {})
              ? {
                  body:
                    apiType === 'list'
                      ? {
                          ...(params.filter ?? params),
                          ...(params.model ?? params),
                        }
                      : {
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

            // list 数据这里自动转换
            if (apiType === 'list') {
              result = {
                data: {
                  [apiSetting.listField!]: result.data,
                  [apiSetting.totalField!]: result.data.length,
                },
              }
            }
          } else {
            result = DEF
          }
        } else {
          result = DEF
        }

        tableEmitter.emit('table-pro:api-success', { result })
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
  emit: TableProGridEmit,
  tableEmitter: Emitter
) {
  const handleExtendProxyConfigResult = handleExtendProxyConfig(tablePropsRef)
  const handleExtendApiResult = handleExtendApi(
    handleExtendProxyConfigResult,
    tableRef,
    emit,
    tableEmitter
  )
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
  emit: TableProGridEmit,
  tableEmitter: Emitter
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
    const tablePropsRef = handleExtendProps(
      handledRowLineHeightTablePropsRef,
      tableRef,
      emit,
      tableEmitter
    )
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
  emit: TableProGridEmit,
  tableEmitter: Emitter
) {
  const defaultPropsRef = createDefaultPropsRef(tableProProps)
  const tablePropsRef = mergePropsRef(defaultPropsRef, paramPropsRef, tableRef, emit, tableEmitter)
  return tablePropsRef
}
