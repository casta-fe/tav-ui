import { withInstall } from '@tav-ui/utils/with-install'
import File from './src/index.vue'

export * from './src/utils/download'
export * from './src/components/FileTypeSelect'
export * from './src/components/FileActionUpload'
export * from './src/components/FileTable'
export * from './src/components/FileVersion'
export * from './src/components/FilePreview'
export * from './src/typings/types'
export const TaFile = withInstall(File)
export default TaFile
