import { withInstall } from '@tav-ui/utils/with-install'
import FileActionUpload from './index.vue'

export * from './types'
export {
  useRequest as useFileActionUploadRequest,
  useFileList as useFileActionUploadFileList,
} from './hooks'
export const TaFileActionUpload = withInstall(FileActionUpload)
export default TaFileActionUpload
