import type { ComputedRef } from 'vue'
import type { CascadeProOption } from './cascade-pro'

export interface IUseCascadeProContext {
  firstLetterVisible: ComputedRef<boolean>
  /** 字段值 */
  fields: ComputedRef<string[]>
  /** 处理源数据 */
  options: ComputedRef<{
    tree: CascadeProOption[]
    group: CascadeProOption[][]
    list: CascadeProOption[]
  }>
  /** 记录当前选中的一条数据 */
  selectRecord: IUseSelectRecordReturn['selectRecord']
  /** 设置当前选中的一条数据 */
  setSelectRecord: IUseSelectRecordReturn['setSelectRecord']
  /** 根据选中数据的 idpath 做解析 */
  selectRecordFibers: IUseSelectRecordReturn['selectRecordFibers']
  /** 记录选中的所有数据 */
  selectRecords: IUseSelectRecordsReturn['selectRecords']
  /** 设置选中的所有数据 */
  setSelectRecords: IUseSelectRecordsReturn['setSelectRecords']
  /** cascade id */
  id: ComputedRef<string>
}

export interface IUseLoadingReturn {
  loading: ComputedRef<boolean>
  setLoading: (loading: boolean) => void
}

export interface IUseSelectRecord {
  defaultValue: ComputedRef<{
    selectRecord: CascadeProOption
    selectRecords: CascadeProOption[]
  }>
  fields: IUseCascadeProContext['fields']
}

export interface IUseSelectRecordReturn {
  selectRecord: ComputedRef<CascadeProOption>
  setSelectRecord: (selectRecord: CascadeProOption) => void
  selectRecordFibers: ComputedRef<{
    id: string
    pid: string
    lastFieldIndex: number
    idPathSplitResult: string[]
  }>
  // setSelectRecordFibers: (selectRecord: string) => void
}

export interface IUseSelectFibers {
  selectRecord: IUseSelectRecordReturn['selectRecord']
  fields: IUseCascadeProContext['fields']
}

export interface IUseSelectFibersReturn {
  selectRecordFibers: ComputedRef<{
    id: string
    pid: string
    lastFieldIndex: number
    idPathSplitResult: string[]
  }>
  setSelectRecordFibers: () => void
}

export interface IUseSelectRecordsReturn {
  selectRecords: ComputedRef<CascadeProOption[]>
  setSelectRecords: (selectRecord: CascadeProOption[], type: 'normal' | 'recover') => void
}

export interface ISearchData {
  firstLetterVisible: IUseCascadeProContext['firstLetterVisible']
  selectRecord: IUseSelectRecordReturn['selectRecord']
  selectRecordFibers: IUseSelectRecordReturn['selectRecordFibers']
  setSelectRecords: IUseSelectRecordsReturn['setSelectRecords']
  options: IUseCascadeProContext['options']
  id: IUseCascadeProContext['id']
}

export interface IUseFieldRequest extends IUseLoadingReturn {
  firstLetterVisible: IUseCascadeProContext['firstLetterVisible']
  selectRecord: IUseSelectRecordReturn['selectRecord']
  selectRecordFibers: IUseSelectRecordReturn['selectRecordFibers']
  setSelectRecord: IUseSelectRecordReturn['setSelectRecord']
  setSelectRecords: IUseSelectRecordsReturn['setSelectRecords']
  fields: IUseCascadeProContext['fields']
  options: IUseCascadeProContext['options']
  id: IUseCascadeProContext['id']
  immediate: boolean
}
