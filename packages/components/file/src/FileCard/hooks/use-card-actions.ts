import { type ComputedRef, type WritableComputedRef, toRaw } from 'vue'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { type FileCardProps } from '../types'
import { type ReturnOf, sleep } from './../../utils'

export interface CardCreateRowsOptions {
  /** 要新增的行数据 */
  rows: FileActionUploadApiResponseRecord[]
  /** 插入行的位置 */
  position?: FileActionUploadApiResponseRecord[] | FileActionUploadApiResponseRecord | null | -1
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface CardReadRowsOptions {
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface CardUpdateRowsOptions {
  /** 要新增的行数据 */
  rows: FileActionUploadApiResponseRecord[]
  /** 要删除的行数据 */
  deleteRows: FileActionUploadApiResponseRecord[]
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface CardDeleteRowsOptions {
  /** 要删除的行数据，不传的话默认删除全部 */
  rows?: FileActionUploadApiResponseRecord[]
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

/**
 * 封装 card 操作数据的方法
 * @param options
 * @returns
 */
export function useCardActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  dataSource: ComputedRef<FileActionUploadApiResponseRecord[]>
  setDataSource: (data: FileActionUploadApiResponseRecord[]) => void
  loading: WritableComputedRef<any>
}) {
  const { dataSource: _dataSource, setDataSource, loading } = options

  async function cardCreateRows(_options: CardCreateRowsOptions) {
    const { rows, position = null, useLoading } = _options
    const dataSource = JSON.parse(
      JSON.stringify(_dataSource.value)
    ) as FileActionUploadApiResponseRecord[]

    if (useLoading !== undefined && useLoading) loading.value.value = true
    let promiseAll
    if (Array.isArray(position)) {
      promiseAll = toRaw(rows).map(async (row, idx) => {
        // 根据 id 查询要插入 row 的位置
        const _idx = dataSource.findIndex((d) => d.id === position[idx].id)
        dataSource.splice(_idx, 0, row)
        return Promise.resolve()
      })
    } else {
      promiseAll = toRaw(rows).map(async (row) => {
        if (position === null) {
          // 顶部
          dataSource.splice(0, 0, row)
        } else if (position === -1) {
          // 底部
          dataSource.splice(dataSource.length, 0, row)
        } else {
          // 根据 id 查询要插入 row 的位置
          const idx = dataSource.findIndex((d) => d.id === position.id)
          dataSource.splice(idx, 0, row)
        }
        return Promise.resolve()
      })
    }
    await Promise.all(promiseAll)
    setDataSource(dataSource)
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  async function cardReadRows(_options: CardReadRowsOptions = {}) {
    const { useLoading } = _options
    const dataSource = JSON.parse(
      JSON.stringify(_dataSource.value)
    ) as FileActionUploadApiResponseRecord[]

    if (useLoading !== undefined && useLoading) loading.value.value = true
    await sleep(150)
    if (useLoading !== undefined && useLoading) loading.value.value = false
    return dataSource
  }

  async function cardUpdateRows(_options: CardUpdateRowsOptions) {
    const { rows, deleteRows, useLoading } = _options
    const dataSource = JSON.parse(
      JSON.stringify(_dataSource.value)
    ) as FileActionUploadApiResponseRecord[]

    if (useLoading !== undefined && useLoading) loading.value.value = true
    const promiseAll = toRaw(rows).map((row, idx) => {
      // 根据 id 查询要插入 row 的位置
      const _idx = dataSource.findIndex((d) => d.id === deleteRows[idx].id)
      dataSource.splice(_idx, 1, row)
      return Promise.resolve()
    })
    await Promise.all(promiseAll)
    setDataSource(dataSource)
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  async function cardDeleteRows(_options: CardDeleteRowsOptions) {
    const { rows, useLoading } = _options
    let dataSource = JSON.parse(
      JSON.stringify(_dataSource.value)
    ) as FileActionUploadApiResponseRecord[]

    if (useLoading !== undefined && useLoading) loading.value.value = true
    // 指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
    if (rows === undefined) {
      dataSource = []
    } else {
      toRaw(rows).forEach((row) => {
        // 根据 id 查询要插入 row 的位置
        const idx = dataSource.findIndex((d) => d.id === row.id)
        dataSource.splice(idx, 1)
      })
    }
    setDataSource(dataSource)
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  return {
    cardCreateRows,
    cardReadRows,
    cardUpdateRows,
    cardDeleteRows,
  }
}

export type UseCardActionsReturn = ReturnOf<typeof useCardActions>
