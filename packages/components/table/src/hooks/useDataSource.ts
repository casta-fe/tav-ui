import { computed, nextTick, onMounted, reactive, ref, unref, watch, watchEffect } from 'vue'
import { cloneDeep, get, merge } from 'lodash-es'
import { useTimeoutFn } from '@tav-ui/hooks/core/useTimeout'
import { isBoolean, isFunction } from '@tav-ui/utils/is'
import { buildUUID } from '@tav-ui/utils/uuid'
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../const'
import { useTableFullHeight } from './useTableFullHeight'
import type { ComputedRef, Ref } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps, FetchParams, SorterResult, TableEmitType } from '../types/table'

type Recordable<T = any> = Record<string, T>
interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}
type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

interface ActionType {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  getFieldsValue: () => Recordable
  clearSelectedRowKeys: () => void
  tableData: Ref<Recordable[]>
}

interface SearchState {
  sortInfo: Recordable
  filterInfo: Record<string, string[]>
}

// 表格筛选整体逻辑：
// 1. 通过 Filter 组件中的 inputform/pannelform 同时只能生效一个，并且发送请求时默认定位到第一页
// 2. 列的排序与筛选同时只能生效一个，并且发送请求时默认定位到第一页

export function useDataSource(
  tableElRef: Ref<ComponentRef>,
  propsRef: ComputedRef<BasicTableProps>,
  {
    getPaginationInfo,
    setPagination,
    setLoading,
    getFieldsValue,
    clearSelectedRowKeys,
    tableData,
  }: ActionType,
  emit: TableEmitType,
  filterRef
) {
  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  })
  const dataSourceRef = ref<Recordable[]>([])
  const rawDataSourceRef = ref<Recordable>({})

  watchEffect(() => {
    tableData.value = unref(dataSourceRef)
  })

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, api } = unref(propsRef)
      !api && dataSource && (dataSourceRef.value = dataSource)
    },
    {
      immediate: true,
    }
  )

  function handleTableChange(
    pagination: PaginationProps,
    filters: Partial<Recordable<string[]>>,
    sorter: SorterResult
  ) {
    const { clearSelectOnPageChange, paginationControl, sortFn, filterFn } = unref(propsRef)
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys()
    }

    const params: Recordable = {}
    if (pagination && paginationControl === 'backend') {
      params.searchInfo = {
        model: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      }
    }
    setPagination(pagination)

    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter)
      searchState.sortInfo = sortInfo
      params.sortInfo = sortInfo

      params.searchInfo = {
        model: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...sortInfo,
        },
      }
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters)
      searchState.filterInfo = filterInfo
      params.filterInfo = filterInfo

      // 筛选出来的数据是数组，默认转为string
      params.searchInfo = {
        filter: {
          ...Object.keys(filterInfo).reduce((result, k) => {
            result[k] = filterInfo[k].join(',')
            return result
          }, {}),
        },
        model: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      }
    }
    fetch(params)
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID()
      }
      if (item.children && item.children.length) {
        setTableKey(item.children)
      }
    })
  }

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef)
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef)
    }
    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0]
      const lastItem = dataSource[dataSource.length - 1]

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = cloneDeep(unref(dataSourceRef))
          data.forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID()
            }
            if (item.children && item.children.length) {
              setTableKey(item.children)
            }
          })
          dataSourceRef.value = data
        }
      }
    }
    return unref(dataSourceRef)
  })

  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index]
    if (record) {
      dataSourceRef.value[index][key] = value
    }
    return dataSourceRef.value[index]
  }

  function updateTableDataRecord(
    rowKey: string | number,
    record: Recordable
  ): Recordable | undefined {
    const row = findTableDataRecord(rowKey)

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field]
      }
      return row
    }
  }

  function deleteTableDataRecord(rowKey: string | number | string[] | number[]) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return
    const rowKeyName = unref(getRowKey)
    if (!rowKeyName) return
    const rowKeys = !Array.isArray(rowKey) ? [rowKey] : rowKey
    for (const key of rowKeys) {
      let index: number | undefined = dataSourceRef.value.findIndex((row) => {
        let targetKeyName: string
        if (typeof rowKeyName === 'function') {
          targetKeyName = rowKeyName(row)
        } else {
          targetKeyName = rowKeyName as string
        }
        return row[targetKeyName] === key
      })
      if (index >= 0) {
        dataSourceRef.value.splice(index, 1)
      }
      index = unref(propsRef).dataSource?.findIndex((row) => {
        let targetKeyName: string
        if (typeof rowKeyName === 'function') {
          targetKeyName = rowKeyName(row)
        } else {
          targetKeyName = rowKeyName as string
        }
        return row[targetKeyName] === key
      })
      if (typeof index !== 'undefined' && index !== -1) unref(propsRef).dataSource?.splice(index, 1)
    }
    setPagination({
      total: unref(propsRef).dataSource?.length,
    })
  }

  function insertTableDataRecord(record: Recordable, index?: number): Recordable | undefined {
    // if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    index = index ?? dataSourceRef.value?.length
    unref(dataSourceRef).splice(index, 0, record)
    return unref(dataSourceRef)
  }

  function findTableDataRecord(rowKey: string | number) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return

    const rowKeyName = unref(getRowKey)
    if (!rowKeyName) return

    const { childrenColumnName = 'children' } = unref(propsRef)

    const findRow = (array: any[]) => {
      let ret
      array.some(function iter(r) {
        if (typeof rowKeyName === 'function') {
          if ((rowKeyName(r) as string) === rowKey) {
            ret = r
            return true
          }
        } else {
          if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
            ret = r
            return true
          }
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter)
      })
      return ret
    }

    // const row = dataSourceRef.value.find(r => {
    //   if (typeof rowKeyName === 'function') {
    //     return (rowKeyName(r) as string) === rowKey
    //   } else {
    //     return Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey
    //   }
    // })
    return findRow(dataSourceRef.value)
  }

  async function fetch(opt?: FetchParams) {
    const {
      api,
      searchInfo,
      defSort,
      fetchSetting,
      beforeFetch,
      afterFetch,
      useSearchForm,
      pagination,
      paginationControl,
    } = unref(propsRef)
    if (!api || !isFunction(api)) return
    if (opt?.clearSelect) clearSelectedRowKeys()
    // fetch Table Filter all params
    await nextTick()
    const tableFilterSearchParams = filterRef.value
      ? JSON.parse(filterRef.value.$el.dataset.filterParams)
      : {}
    const tableFilterSearchInfo = {
      filter: tableFilterSearchParams,
    }

    try {
      setLoading(true)
      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting
      )
      let pageParams: Recordable = {}

      const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo) as PaginationProps

      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {}
      } else {
        pageParams[pageField] = (opt && opt.page) || current
        pageParams[sizeField] = pageSize

        pageParams['model'] = {
          page: (opt && opt.page) || current,
          limit: pageSize,
        }
      }

      const { sortInfo = {}, filterInfo } = searchState
      pageParams.model = { ...pageParams.model, ...sortInfo }
      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        searchInfo,
        tableFilterSearchInfo,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {}
      )
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params
      }

      // eslint-disable-next-line no-console
      console.log('hijack table api 😂')

      const { data: res } = await api(params)
      rawDataSourceRef.value = res

      const isArrayResult = Array.isArray(res)

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField)
      const resultTotal: number = isArrayResult ? 0 : get(res, totalField)

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      // 因为通过 Filter 走的查询默认调到第一页所以这个判断先注释，如果默认当前页面则需要开启
      // if (resultTotal) {
      //   const currentTotalPage = Math.ceil(resultTotal / pageSize);
      //   if (current > currentTotalPage) {
      //     setPagination({
      //       current: currentTotalPage
      //     });
      //     return await fetch(opt);
      //   }
      // }

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems
      }
      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal || 0,
      })
      if (opt && (opt.page || opt.searchInfo?.model?.page)) {
        setPagination({
          current: opt.page || opt.searchInfo?.model?.page || 1,
        })
      }

      if (paginationControl === 'backend' && !isArrayResult) {
        setPagination({
          pageSize: rawDataSourceRef.value[sizeField] || pageSize,
        })

        nextTick(() => {
          const els = tableElRef.value?.$el?.querySelectorAll(
            '.ant-table-pagination .ant-pagination-item'
          ) as NodeListOf<HTMLElement>
          els?.forEach((el) => {
            const page = Number(el.title)
            if (
              rawDataSourceRef.value.navigatePageNumbers &&
              rawDataSourceRef.value.navigatePageNumbers.includes(page)
            ) {
              el.style.display = 'inline-block'
              // return originalElement;
            } else {
              el.style.display = 'none'
            }
          })
        })
      }
      useTableFullHeight(propsRef, tableElRef)

      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      })
      return resultItems
    } catch (error) {
      emit('fetch-error', error)
      dataSourceRef.value = []
      setPagination({
        total: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  function setTableData<T = Recordable>(values: T[]) {
    dataSourceRef.value = values
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[]
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T
  }

  async function reload(opt?: FetchParams) {
    // eslint-disable-next-line no-return-await
    return await fetch(opt)
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch()
    }, 16)
  })

  return {
    getDataSourceRef,
    getDataSource,
    getRawDataSource,
    getRowKey,
    setTableData,
    getAutoCreateKey,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleTableChange,
  }
}
