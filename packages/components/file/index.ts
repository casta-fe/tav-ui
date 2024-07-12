import { withInstall } from '@tav-ui/utils/with-install'
import File from './src/index.vue'

export * from './src/components/FileTypeSelect'
export * from './src/components/FileActionUpload'
export * from './src/components/FileTable'
export * from './src/typings'
export const TaFile = withInstall(File)
export default TaFile
