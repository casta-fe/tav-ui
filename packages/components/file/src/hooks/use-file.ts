// import { onUnmounted, ref, toRaw, unref, watch } from 'vue'
// import { getDynamicProps } from '@tav-ui/utils/basic'
// import { error } from '@tav-ui/utils/log'
// import type { FormActionType } from '@tav-ui/components/form/src/types/form'
// import type { ComputedRef, Ref, WatchStopHandle } from 'vue'
// import type { PaginationProps } from '../types/pagination'
// import type { BasicColumn, BasicTableProps, FetchParams, TableActionType } from '../types/table'

// type Props = Partial<DynamicProps<BasicTableProps>>
// type DynamicProps<T> = {
//   [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>
// }
// type Recordable<T = any> = Record<string, T>

// const isProdMode = () => true

// type UseTableMethod = TableActionType & {
//   getForm: () => FormActionType
// }

// type Nullable<T> = T | null

// export function useTable(tableProps?: Props): [
//   (instance: TableActionType, formInstance: UseTableMethod) => void,
//   TableActionType & {
//     getForm: () => FormActionType
//   }
// ] {
//   const tableRef = ref<Nullable<TableActionType>>(null)
//   const loadedRef = ref<Nullable<boolean>>(false)
//   let stopWatch: WatchStopHandle

//   function register(instance: TableActionType, formInstance: UseTableMethod) {
//     isProdMode() &&
//       onUnmounted(() => {
//         tableRef.value = null
//         loadedRef.value = null
//       })

//     if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return

//     tableRef.value = instance
//     tableProps && instance.setProps(getDynamicProps(tableProps))
//     loadedRef.value = true
//     stopWatch?.()

//     stopWatch = watch(
//       () => tableProps,
//       () => {
//         tableProps && instance.setProps(getDynamicProps(tableProps))
//       },
//       {
//         immediate: true,
//         deep: true,
//       }
//     )
//   }

//   function getTableInstance(): TableActionType {
//     const table = unref(tableRef)
//     if (!table) {
//       error(
//         'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
//       )
//     }
//     return table as TableActionType
//   }

//   const methods: TableActionType = {
//     reload: async (opt?: FetchParams) => {
//       // eslint-disable-next-line no-return-await
//       return await getTableInstance().reload(opt)
//     },
//     setProps: (props: Partial<BasicTableProps>) => {
//       getTableInstance().setProps(props)
//     },
//     setLoading: (loading: boolean) => {
//       getTableInstance().setLoading(loading)
//     },
//     setMasking: (loading: boolean) => {
//       getTableInstance().setMasking(loading)
//     },
//     getDataSource: () => {
//       return getTableInstance().getDataSource()
//     },
//     getRawDataSource: () => {
//       return getTableInstance().getRawDataSource()
//     },
//     setTableDataSource: (values: any[]) => {
//       return getTableInstance().setTableDataSource(values)
//     },
//     getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
//       const columns = getTableInstance().getColumns({ ignoreIndex }) || []
//       return toRaw(columns)
//     },
//     setColumns: (columns: BasicColumn[] | string[]) => {
//       getTableInstance().setColumns(columns)
//     },
//     updateTableData: (index: number, key: string, value: any) => {
//       return getTableInstance().updateTableData(index, key, value)
//     },
//     deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
//       return getTableInstance().deleteTableDataRecord(rowKey)
//     },
//     insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
//       return getTableInstance().insertTableDataRecord(record, index)
//     },
//     updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
//       return getTableInstance().updateTableDataRecord(rowKey, record)
//     },
//     findTableDataRecord: (rowKey: string | number) => {
//       return getTableInstance().findTableDataRecord(rowKey)
//     },
//     scrollTo: (pos: string) => {
//       getTableInstance().scrollTo(pos)
//     },
//   }

//   return [register, methods]
// }
