import { withInstall } from '@tav-ui/utils/with-install'
import Table from './src/table.vue'
const TaTable = withInstall(Table)
export type { EditRecordRow } from './src/components/editable'
// export { default as EditTableHeaderIcon } from './src/components/EditTableHeaderIcon.vue'
export { default as TableAction } from './src/components/TableAction.vue'
export { default as TableImg } from './src/components/TableImg.vue'
export { ROW_KEY as DEFAULT_ROW_KEY } from './src/const'
export * from './src/types/pagination'
export * from './src/types/table'
export * from './src/types/tableAction'
export { TaTable }
export default TaTable
export { useTable } from './src/hooks/useTable'
// export * from './src/props'
export * from './src/types/table'
