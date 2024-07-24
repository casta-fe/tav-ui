import { withInstall } from '@tav-ui/utils/with-install'
import FileActionUploadLink from './index.vue'
import FileActionUploadLinkForm from './form.vue'

export * from './types'
export const TaFileActionUploadLink = withInstall(FileActionUploadLink)
export const TaFileActionUploadLinkForm = withInstall(FileActionUploadLinkForm)
export default TaFileActionUploadLink
