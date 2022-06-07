import { withInstall } from '@tav-ui/utils/with-install'
import Table from './src/table.vue'
import tableAction from './src/components/TableAction.vue'
import tableImg from './src/components/TableImg.vue'
import tableFilter from './src/components/Filter.vue'
import tableCustomAction from './src/components/CustomAction.vue'
const TaTable = withInstall(Table)
const TableAction = withInstall(tableAction)
const TableImg = withInstall(tableImg)
const TableFilter = withInstall(tableFilter)
const TableCustomAction = withInstall(tableCustomAction)
export type { EditRecordRow } from './src/components/editable'
export { ROW_KEY as DEFAULT_ROW_KEY } from './src/const'
export * from './src/types/pagination'
export * from './src/types/table'
export * from './src/types/tableAction'
export { TaTable, TableAction, TableImg, TableFilter, TableCustomAction }
export default TaTable
export { useTable } from './src/hooks/useTable'
export { useComputedHeight } from './src/hooks/useComputedHeight'
// export * from './src/props'
export * from './src/types/table'
