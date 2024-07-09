import { withInstall } from '@tav-ui/utils/with-install'
import FileActions from './index.vue'

export * from './components/FileActionUpload'
export * from './components/FileActionUploadLink'
export * from './hooks'
export * from './types'
export const TaFileActions = withInstall(FileActions)
export default TaFileActions
