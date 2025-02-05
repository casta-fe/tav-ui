import { withInstall } from '@tav-ui/utils/with-install'
import File from './src/index.vue'

export * from './src/utils/download'
export * from './src/components/FileTypeSelect'
export * from './src/components/FileActionUpload'
export * from './src/components/FileActionUploadLink'
export * from './src/components/FileTable'
export * from './src/components/FileVersion'
export * from './src/components/FilePreview'
export * from './src/components/FileLog'
export * from './src/FileCards'
export * from './src/FileCard'
export * from './src/components/FileUpload'
export * from './src/components/FileUploadPreview'
export * from './src/typings/types'
export {
  DEFAULT_FILE_ACCEPT_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
  DEFAULT_FILE_IGNORE_TYPES,
} from './src/consts'

export const TaFile = withInstall(File)
export default TaFile
