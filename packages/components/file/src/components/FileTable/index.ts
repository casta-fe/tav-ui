import { withInstall } from '@tav-ui/utils/with-install'
import FileTable from './index.vue'

export * from './components/FileVersion'
// export * from './components/FileView'
export * from './types'
export const TaFileTable = withInstall(FileTable)
export default TaFileTable
