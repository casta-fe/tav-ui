import { withInstall } from '@tav-ui/utils/with-install'
import FileUpload from './index.vue'

export { transformUrlToFileUploadPreviewPropFile } from './use-api'
export * from './types'
export const TaFileUpload = withInstall(FileUpload)
export default TaFileUpload
