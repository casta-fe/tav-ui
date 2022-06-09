// import { deepMerge } from '@tav-ui/utils/basic'
// import { cloneDeep } from 'lodash-es'
import { computed, unref } from 'vue'
import { useTimeoutFn } from '@tav-ui/hooks/core/useTimeout'
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
        result: `data.${apiSetting.listField}`,
        total: `data.${apiSetting.totalField}`,
      }
      if (!hasProxyConfigProps) {
        unref(tablePropsRef).proxyConfig = { props }
      }
    }
  }

  return tablePropsRef
}

/**
 * 根据 props scrollToRawPos 扩展 afterapi
 * @param tablePropsRef
 * @param tableRef
 * @param emit
 */
function handleExtenAfterApi(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>
) {
  const { afterApi, scrollToRawPos } = unref(tablePropsRef)
  const hasAfterApi = afterApi && isFunction(afterApi)
  if (hasAfterApi) {
    const _afterApi = afterApi
    unref(tablePropsRef)['afterApi'] = async function (result) {
      const returnValue = _afterApi(result)
      scrollToRawPos &&
        useTimeoutFn(() => {
          unref(tableRef.value)?.scrollTo(0, 0)
        }, 16)
      if (returnValue) return returnValue
    }
  } else {
    unref(tablePropsRef)['afterApi'] = async function () {
      scrollToRawPos &&
        useTimeoutFn(() => {
          unref(tableRef.value)?.scrollTo(0, 0)
        }, 16)
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
function handleExtenApi(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const { api, beforeApi, afterApi } = unref(tablePropsRef)
  const hasApi = api && isFunction(api)

  if (hasApi) {
    /**  处理 vxetable proxy */
    // 缓存api option
    let params: TableProApiParams = {
      filter: {},
      model: {},
    }
    let result: Record<string, any> = {}
    // 关闭自动加载，自动加载使用commit实现
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
          ? { ...option, ...{ model }, ...option.model }
          : { ...option, ...{ model } }
        : { ...params, ...{ model } }
      try {
        if (beforeApi && isFunction(beforeApi)) {
          params = (await beforeApi(option)) || option
        }

        if (api && isFunction(api)) {
          // eslint-disable-next-line no-console
          console.log('hijack table pro api 😂')

          const apiResult = await api(params)

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
        // unref(tableRef.value)?.loadData(result)
        return Promise.resolve(result)
      } catch (error) {
        emit('ApiError', error)
        return Promise.resolve(DEF)
      }
    }
    // 要使用beforequery则query必须存在
    unref(tablePropsRef).proxyConfig!['ajax'] = {
      query: () => Promise.resolve({}),
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
  const handleExtenAfterApiResult = handleExtenAfterApi(handleExtendProxyConfigResult, tableRef)
  const handleExtenApiResult = handleExtenApi(handleExtenAfterApiResult, tableRef, emit)
  return handleExtenApiResult
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
      if (unref(defaultPropsRef)[key]) {
        // 只对对象进行合并，其他类型已传入的值为准
        if (isObject(unref(defaultPropsRef)[key])) {
          // // 会有性能问题，暂时浅合并
          // unref(paramPropsRef)[key] = deepMerge(
          //   cloneDeep(unref(defaultPropsRef)[key]),
          //   cloneDeep(unref(paramPropsRef)[key])
          // )
          // 浅合并
          unref(paramPropsRef)[key] = {
            ...unref(defaultPropsRef)[key],
            ...unref(paramPropsRef)[key],
          }
        }
      }
    }
    const tablePropsRef = handleExtendProps(paramPropsRef, tableRef, emit)
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
