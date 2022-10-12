import { unref, watch } from 'vue'
import { treeToList } from '@tav-ui/utils'
import { ComponentName } from '../const'
import type { ConfigProviderContext } from '@tav-ui/hooks/global/useGlobalProvider'
import type { ComputedRef, Ref } from 'vue'
import type { TableProColumn, TableProProps } from '../types'
import type { CustomActionRef } from '../typings'

export function useColumnApi(
  tablePropsRef: ComputedRef<TableProProps>,
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
  function getTableId() {
    return unref(tablePropsRef).id!
  }

  /** 获取表格列数据参数 module */
  function getColumnApiParamModule() {
    return `appId:${appId}_user:${userInfo?.phone}_table:${getTableId()}`
  }

  /** 获取表格列数据参数 version */
  function getColumnApiParamVersion() {
    return `appId:${appId}_user:${userInfo?.phone}_table:${getTableId()}`
  }

  /** 获取表格列持久化接口信息 */
  function getColumnApiInfo(
    columnSettingInfo: any,
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

    if (columnSettingInfo) {
      apiInfo.params.tableJson = JSON.stringify(columnSettingInfo)
    } else {
      Reflect.deleteProperty(apiInfo.params, 'tableJson')
    }

    return apiInfo
  }

  /** 获取表格列配置，覆盖当前列 */
  function useCachedColumnCoverCurrentColumns(
    getColumns: ComputedRef<{
      columns: TableProColumn[]
    }>,
    customActionRef: Ref<CustomActionRef | null>
  ) {
    /**
     * 必须已当前传入的columns为主，因为传入的列配置中可能包含自定义逻辑
     * @param columns
     * @param cachedColumns
     * @returns
     */
    const handleMerge = (columns, cachedColumns) => {
      if (!cachedColumns && !cachedColumns.length) return columns

      const columnsList = treeToList(columns, { id: 'key' })

      const handleColumn = (cachedColumn) => {
        const targetColumn = columnsList.find((column) => {
          const { key } = cachedColumn
          const keySplitResult = key.split('-')
          const targetKey = keySplitResult[keySplitResult.length - 1]
          const targetKeySplitResult = targetKey.split('_')
          const field = targetKeySplitResult[targetKeySplitResult.length - 1]
          return field === column.field
        })

        if (targetColumn) {
          return {
            ...targetColumn,
            title: cachedColumn.title,
            key: cachedColumn.key,
            disabled: cachedColumn.disabled,
          }
        } else {
          return null
        }
      }

      const traverse = (cachedColumns) => {
        return cachedColumns.map((cachedColumn) => {
          if (cachedColumn.children && cachedColumn.children.length) {
            const current = handleColumn(cachedColumn)
            const children = traverse(cachedColumn.children)
            return { ...current, children }
          } else {
            return handleColumn(cachedColumn)
          }
        })
      }

      return traverse(cachedColumns)
    }

    const coverCurrentColumns = async (columns) => {
      const { api, params } = getColumnApiInfo(null, 'get')
      const { success, data } = await api(params)
      if (success && data && data.tableJson) {
        const { options: cachedColumns, checkedList } = JSON.parse(data.tableJson)
        const options = handleMerge(columns, cachedColumns)
        const coverColumnsSetting = (customActionRef.value?.settingsRef as any).columnRef
          .coverColumnsSetting
        if (coverColumnsSetting) coverColumnsSetting(options, checkedList)
      }
    }

    watch(
      () => getColumns,
      (val) => {
        if (val && val.value.columns && val.value.columns.length > 0) {
          // 在原本column载入后再加载接口中的列配置
          unref(tablePropsRef).customActionConfig.column && coverCurrentColumns(val.value.columns)
        }
      },
      { deep: true, immediate: true }
    )
  }

  return {
    getTableId,
    getColumnApiParamModule,
    getColumnApiParamVersion,
    getColumnApiInfo,
    useCachedColumnCoverCurrentColumns,
  }
}

export type TableProColumnApiOptions = ReturnType<typeof useColumnApi>
