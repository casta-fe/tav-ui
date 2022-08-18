import { withInstall } from '@tav-ui/utils/with-install'
import { UpdateFile } from './src/components'
import { default as Upload } from './src/Upload'
export const TaUpdateFile = UpdateFile
export const TaUpload = withInstall(Upload)
export default TaUpload
export * from './src/hooks'
export type { BasicPropsType as UploadBasciProps } from './src/types'
