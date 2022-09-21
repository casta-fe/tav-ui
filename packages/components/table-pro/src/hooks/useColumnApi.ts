import { unref } from 'vue'
import { ComponentName } from '../const'
import type { ConfigProviderContext } from '@tav-ui/hooks/global/useGlobalProvider'
import type { Ref } from 'vue'
import type { BasicTableProContext } from './useTableContext'

export function useColumnApi(
  tableContext: BasicTableProContext,
  globalContext: Ref<Partial<ConfigProviderContext>>
) {
  const globalConfig = unref(globalContext)
  if (!globalConfig) return null
  const globalConfigComponents = unref(globalConfig)['components']
  if (!globalConfigComponents) return null
  const tableGlobalConfig = unref(globalConfigComponents)[ComponentName]
  if (!tableGlobalConfig) return null
  const appId = unref(globalConfig)['appId']
  const userInfo = unref(globalConfig)['userInfo']
  const columnsGetApi = tableGlobalConfig.columnsGetApi
  const columnsSetApi = tableGlobalConfig.columnsSetApi
  if (!userInfo || !columnsGetApi || !columnsSetApi) return null

  /** 获取当前table id */
  function getTableUUID() {
    const tableId = tableContext.tableRef?.value?.id!
    return tableId.split('-')[1]
  }

  /** 获取表格列数据参数 module */
  function getColumnApiParamModule() {
    return `appId:${appId}_user:${userInfo?.phone}_table:${getTableUUID()}`
  }

  /** 获取表格列数据参数 version */
  function getColumnApiParamVersion() {
    return `appId:${appId}_user:${userInfo?.phone}_table:${getTableUUID()}`
  }

  /** 获取表格列持久化接口信息 */
  function getColumnApiInfo(
    columns: any,
    type: 'get' | 'set',
    module = getColumnApiParamModule(),
    version = getColumnApiParamVersion()
  ) {
    const apiInfo = {
      api: null as any,
      params: {
        module,
        version,
        tableJson: null as any,
      },
    }
    if (type === 'get') {
      const api = columnsGetApi
      if (api) apiInfo.api = api
    }

    if (type === 'set') {
      const api = columnsSetApi
      if (api) {
        apiInfo.api = api
      }
    }

    if (columns) {
      apiInfo.params.tableJson = columns
    } else {
      Reflect.deleteProperty(apiInfo.params, 'tableJson')
    }

    return apiInfo
  }

  return {
    getTableUUID,
    getColumnApiParamModule,
    getColumnApiParamVersion,
    getColumnApiInfo,
  }
}

export type TableProColumnApiOptions = ReturnType<typeof useColumnApi>
