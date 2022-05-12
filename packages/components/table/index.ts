import { withInstall } from '@tav-ui/utils/with-install'
import Table from './src/table.vue'
import tableAction from './src/components/TableAction.vue'
import tableImg from './src/components/TableImg.vue'
const TaTable = withInstall(Table)
const TableAction = withInstall(tableAction)
const TableImg = withInstall(tableImg)
export type { EditRecordRow } from './src/components/editable'
export { ROW_KEY as DEFAULT_ROW_KEY } from './src/const'
export * from './src/types/pagination'
export * from './src/types/table'
export * from './src/types/tableAction'
export { TaTable, TableAction, TableImg }
export default TaTable
export { useTable } from './src/hooks/useTable'
// export * from './src/props'
export * from './src/types/table'
